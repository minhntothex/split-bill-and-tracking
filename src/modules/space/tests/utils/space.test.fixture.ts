import { Types } from 'mongoose';

import { Space } from '../../space.dtos';
import { createDoc } from './doc.test.fixture';

export function createRecord(overrides: Record<string, unknown> = {})
{
    const space = createSpace(overrides);
    return createDoc(space);
}

export function createSpace(overrides: Record<string, unknown> = {}): Space
{
    const date = new Date();

    return {
        _id: new Types.ObjectId(),
        name: 'Fake Space',
        description: 'This is a fake space',
        icon: 'icon_1',
        categories: ['category_1', 'category_2'],
        members: [
            { email: 'a@b.com', role: 'owner', addedBy: 'a@b.com', joinedAt: date },
            { email: 'b@b.com', role: 'member', addedBy: 'a@b.com', joinedAt: date },
        ],
        createdAt: date,
        updatedAt: date,
        active: true,
        ...overrides,
    };
}