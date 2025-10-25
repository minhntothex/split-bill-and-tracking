import { Types } from 'mongoose';

import { NextToken } from '../../nextToken';

function makeToken({ updatedAt, _id }: { updatedAt: Date, _id: Types.ObjectId })
{
    return Buffer.from(JSON.stringify({ updatedAt: updatedAt.toISOString(), _id: _id.toString() }), 'utf-8').toString('base64url');
}

describe('nextToken', () => 
{
    const mockPayload = { updatedAt: new Date(), _id: new Types.ObjectId() };

    describe('encode', () => 
    {
        it('encodes a payload into a Base64 token string', () => 
        {
            const expected = makeToken(mockPayload);
            const token = NextToken.encode(mockPayload);
            expect(token).toBe(expected);
        });
    });

    describe('decode', () => 
    {
        it('decodes a Base64 token string into a payload object', () => 
        {
            const token = makeToken(mockPayload);
            const payload = NextToken.decode(token);
            expect(payload).toEqual(mockPayload);
        });

        it('throws when token is invalid', () => 
        {
            expect(() => NextToken.decode('invalid')).toThrow('Invalid or malformed nextToken');
        });
    });

    describe('buildQueryFromToken', () => 
    {
        it('builds a MongoDB pagination filter from a nextToken', () => 
        {
            const token = makeToken(mockPayload);
            const query = NextToken.buildQueryFromToken(token);
            expect(query).toEqual({
                $or: [
                    { updatedAt: { $lt: mockPayload.updatedAt } },
                    { updatedAt: mockPayload.updatedAt, _id: { $lte: mockPayload._id } },
                ],
            });
        });

        it('returns an empty query when no token is provided', () => 
        {
            const query = NextToken.buildQueryFromToken();
            expect(query).toEqual({});
        });
    });
});