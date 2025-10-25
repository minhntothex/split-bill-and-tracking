import { Types } from 'mongoose';

/**
 * Creates a mock Mongoose document for unit testing.
 *
 * This utility wraps a plain record (created by `createRecord`) with
 * Jest-mocked methods that simulate Mongoose document behavior:
 * - `.set()` merges new fields into the document.
 * - `.markModified()`, `.validate()`, and `.save()` are jest.fn() mocks.
 * - `.toObject()` returns the current record state.
 *
 * @template T The type of the document data.
 * @param createRecord A function that returns a base plain record (object) of type `T`.
 * @returns A mock document object with Mongoose-like methods.
 *
 * @example
 * ```ts
 * const doc = makeDoc(() => ({ _id: '1', name: 'Test Space' }));
 * doc.set({ name: 'Updated Space' });
 * expect(doc.toObject()).toEqual({ _id: '1', name: 'Updated Space' });
 * ```
 */
export function createDoc<T = any>(item: T):
T & {
    set: jest.Mock<any, any, any>;
    markModified: jest.Mock<any, any, any>;
    validate: jest.Mock<any, any, any>;
    save: jest.Mock<any, any, any>;
    toObject: jest.Mock<T, [], any>;
}
{
    let itemCopy = { _id: new Types.ObjectId(), ...item };

    return {
        ...itemCopy,
        set: jest.fn().mockImplementation((data: Partial<T>) => 
        {
            itemCopy = { ...itemCopy, ...data };
        }),
        markModified: jest.fn(),
        validate: jest.fn(),
        save: jest.fn(),
        toObject: jest.fn(() => itemCopy),
    };
}