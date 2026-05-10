import 'server-only';

import { ObjectId, type Collection } from 'mongodb';

import { getDb } from '@/lib/db/mongodb';

export type SessionUser = {
    id: string;
    phoneNumber: string;
    displayName: string;
    createdAt: string;
    updatedAt: string;
};

type UserDocument = {
    _id: ObjectId;
    phoneNumber: string;
    displayName: string;
    createdAt: Date;
    updatedAt: Date;
};

type CreateUserInput = {
    phoneNumber: string;
    displayName: string;
};

let usersCollectionPromise: Promise<Collection<UserDocument>> | undefined;

async function getUsersCollection(): Promise<Collection<UserDocument>> {
    usersCollectionPromise ??= (async () => {
        const db = await getDb();
        const collection = db.collection<UserDocument>('users');

        await collection.createIndex({ phoneNumber: 1 }, { unique: true });

        return collection;
    })();

    return usersCollectionPromise;
}

function mapUser(document: UserDocument): SessionUser {
    return {
        id: document._id.toHexString(),
        phoneNumber: document.phoneNumber,
        displayName: document.displayName,
        createdAt: document.createdAt.toISOString(),
        updatedAt: document.updatedAt.toISOString(),
    };
}

export async function findUserByPhoneNumber(phoneNumber: string): Promise<SessionUser | null> {
    const collection = await getUsersCollection();
    const user = await collection.findOne({ phoneNumber });

    return user ? mapUser(user) : null;
}

export async function createUser(input: CreateUserInput): Promise<SessionUser> {
    const collection = await getUsersCollection();
    const now = new Date();
    const document: UserDocument = {
        _id: new ObjectId(),
        phoneNumber: input.phoneNumber,
        displayName: input.displayName,
        createdAt: now,
        updatedAt: now,
    };
    await collection.insertOne(document);

    return mapUser(document);
}

export async function updateUserDisplayName(userId: string, displayName: string): Promise<SessionUser> {
    const collection = await getUsersCollection();
    const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        {
            $set: {
                displayName,
                updatedAt: new Date(),
            },
        },
        {
            returnDocument: 'after',
        },
    );

    if (!result) {
        throw new Error(`User not found for id ${userId}.`);
    }

    return mapUser(result);
}

export async function findUserById(userId: string): Promise<SessionUser | null> {
    if (!ObjectId.isValid(userId)) {
        return null;
    }

    const collection = await getUsersCollection();
    const user = await collection.findOne({
        _id: new ObjectId(userId),
    });

    return user ? mapUser(user) : null;
}

export const userRepository = {
    findByPhoneNumber: findUserByPhoneNumber,
    createUser,
    updateDisplayName: updateUserDisplayName,
    findById: findUserById,
};
