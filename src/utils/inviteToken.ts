import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const INVITE_SECRET = process.env.TOKEN_SECRET ?? 'sb&t-app-secret';

export class InviteToken 
{
    static create(objId_spaceId: Types.ObjectId): string 
    {
        const spaceId = objId_spaceId.toString();
        return jwt.sign({ spaceId }, INVITE_SECRET);
    }

    static verify(token: string): { spaceId: Types.ObjectId } 
    {
        let payload: { spaceId?: string };
        try 
        {
            payload = jwt.verify(token, INVITE_SECRET) as typeof payload;
        }
        catch(error) 
        {
            console.error(error);
            throw new Error('Invalid or malformed invite token');
        }

        if (!payload.spaceId) throw new Error('Invalid token payload');
        if (!Types.ObjectId.isValid(payload.spaceId)) throw new Error('Invalid token payload');

        return { ...payload, spaceId: new Types.ObjectId(payload.spaceId) };
    }
}
