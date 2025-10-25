import { DynamicModule, INestApplication } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { App } from 'supertest/types';

/**
 * Provides a fully in-memory MongoDB instance using `mongodb-memory-server`.
 * 
 * Useful for integration testing or lightweight environments where
 * no real database connection is desired.
 */
export class InMemoryDatabase
{
    private readonly server: MongoMemoryServer;
    private uri?: string;

    private constructor(server: MongoMemoryServer) { this.server = server; }

    /** Factory method to bootstrap an in-memory MongoDB instance. */
    static async bootstrap(): Promise<InMemoryDatabase> 
    {
        const server = await MongoMemoryServer.create({
            instance: {
                storageEngine: 'wiredTiger',
                dbName: 'testdb',
            },
        });

        const db = new InMemoryDatabase(server);
        await db.ensureReady();
        return db;
    }

    /** Light ping to ensure instance already ran */
    private async ensureReady(): Promise<void> 
    {
        const uri = this.getUri();
        const temp = await mongoose.createConnection(uri).asPromise();
        await temp.close();
    }

    /** Returns the MongoDB connection URI of the in-memory instance. */
    getUri(): string 
    {
        if (!this.uri) { this.uri = this.server.getUri(); }
        return this.uri;
    }

    /** Provides a dynamic NestJS module for Mongoose connection. */
    asModule(): DynamicModule 
    {
        return MongooseModule.forRoot(this.getUri());
    }

    /** Gracefully shuts down the in-memory MongoDB server. */
    async stop(): Promise<void> 
    {
        await this.server.stop({ doCleanup: true, force: true });
    }
}

/**
 * A helper client that shares the same Mongoose connection
 * used by NestJS, allowing direct access to collections in tests.
 */
export class InMemoryDatabaseTestClient 
{
    private readonly moduleRef: ModuleRef;
    private connection?: mongoose.Connection;

    constructor(moduleRef: ModuleRef) { this.moduleRef = moduleRef; }

    /** Attach the existing Mongoose connection from NestJS */
    async connect(): Promise<mongoose.Connection>
    {
        this.connection = this.moduleRef.get<mongoose.Connection>(getConnectionToken(), { strict: false });
        if (!this.connection) { throw new Error('Mongoose connection not found'); }

        if (this.connection.readyState !== mongoose.ConnectionStates.connected) 
        {
            await new Promise<void>((resolve, reject) => 
            {
                this.connection?.once('connected', () => resolve());
                this.connection?.once('error', reject);
            });
        }
        
        return this.connection;
    }

    /** Returns a raw MongoDB collection handle by name. */
    collection(name: string) 
    {
        if (!this.connection?.db) { throw new Error('Database not connected'); }
        return this.connection.db.collection(name);
    }

    /** Gracefully close and stop the memory server. */
    async close(): Promise<void> 
    {
        await this.connection?.close();
    }
}

export type InMemoryApp = {
    app: INestApplication<App>;
    close: () => Promise<void>;
};

/**
 * Creates a fully initialized NestJS application + in-memory MongoDB + test client.
 * 
 * Example:
 * ```ts
 * const { app, client, close } = await createTestApp([SpaceModule]);
 * const spaces = client.collection('spaces');
 * await spaces.insertMany(mockData);
 * 
 * await request(app.getHttpServer()).get('/spaces').expect(200);
 * await close();
 * ```
 */
export async function createTestApp(modules: any[]): Promise<InMemoryApp> 
{
    const db = await InMemoryDatabase.bootstrap();

    console.log('# Compiling module');
    const moduleFixture = await Test.createTestingModule({
        imports: [db.asModule(), ...modules],
    }).compile();

    console.log('# Creating app');
    const app = moduleFixture.createNestApplication();
    await app.init();

    console.log('# Return test app');
    return {
        app,
        async close() 
        {
            await app.close();
            await db.stop();
        },
    };
}
