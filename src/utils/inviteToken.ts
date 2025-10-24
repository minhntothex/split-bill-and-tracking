import jwt from 'jsonwebtoken';

const INVITE_SECRET = process.env.TOKEN_SECRET ?? 'sb&t-app-secret';

export class InviteToken 
{
    static create(spaceId: string): string 
    {
        return jwt.sign({ spaceId }, INVITE_SECRET);
    }

    static verify(token: string): { spaceId: string } 
    {
        try 
        {
            const payload = jwt.verify(token, INVITE_SECRET) as { spaceId: string };
            if (!payload.spaceId) throw new Error('Invalid token payload');
            return payload;
        }
        catch 
        {
            throw new Error('Invalid or malformed invite token');
        }
    }
}
