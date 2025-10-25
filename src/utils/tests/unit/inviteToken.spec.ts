import jwt from 'jsonwebtoken';

import { InviteToken } from '../../inviteToken';
import { Types } from 'mongoose';

jest.mock('jsonwebtoken');

describe('InviteToken', () => 
{
    const mockSecret = 'sb&t-app-secret';

    beforeEach(() => 
    {
        jest.clearAllMocks();
        process.env.TOKEN_SECRET = mockSecret;
    });

    describe('create', () => 
    {
        it('creates a signed JWT with spaceId', () => 
        {
            const spaceId = new Types.ObjectId();
            (jwt.sign as jest.Mock).mockReturnValue('signed-token');

            const token = InviteToken.create(spaceId);

            expect(jwt.sign).toHaveBeenCalledWith({ spaceId: spaceId.toString() }, mockSecret);
            expect(token).toBe('signed-token');
        });
    });

    describe('verify', () => 
    {
        it('returns payload when token is valid', () => 
        {
            const token = 'valid-token';
            const payload = { spaceId: new Types.ObjectId() };
            (jwt.verify as jest.Mock).mockReturnValue(payload);

            const result = InviteToken.verify(token);

            expect(jwt.verify).toHaveBeenCalledWith(token, mockSecret);
            expect(result).toMatchObject(payload);
        });

        it('throws when jwt.verify throws', () => 
        {
            (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token'); });
            expect(() => InviteToken.verify('bad-token')).toThrow('Invalid or malformed invite token');
        });

        it('throws when payload has no spaceId', () => 
        {
            (jwt.verify as jest.Mock).mockReturnValue({});
            expect(() => InviteToken.verify('token')).toThrow('Invalid token payload');
        });

        it('throws when spaceId is not a valid ObjectId', () =>
        {
            (jwt.verify as jest.Mock).mockReturnValue({ spaceId: 'invalid' });
            expect(() => InviteToken.verify('token')).toThrow('Invalid token payload');
        });
    });
});
