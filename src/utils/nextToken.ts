import { FilterQuery } from 'mongoose';
import { z } from 'zod';

import { ObjectId } from '../modules/database/database.types';

const NextTokenPayload = z.object({
    updatedAt: z.union([z.iso.datetime(), z.date()]).transform(date => new Date(date)),
    _id: ObjectId,
});

export type NextTokenPayload = z.infer<typeof NextTokenPayload>;

export class NextToken 
{
    /**
     * Encode a payload into a Base64 token string.
    */
    static encode(payload: NextTokenPayload): string 
    {
        const json = JSON.stringify({ updatedAt: payload.updatedAt.toISOString(), _id: payload._id.toString() });
        return Buffer.from(json, 'utf-8').toString('base64url'); // url-safe
    }

    /**
     * Decode a Base64 token string into a payload object.
     */
    static decode(token: string): NextTokenPayload 
    {
        try 
        {
            const json = Buffer.from(token, 'base64url').toString('utf-8');
            const parsed = JSON.parse(json);
            return NextTokenPayload.parse(parsed);
        }
        catch 
        {
            throw new Error('Invalid or malformed nextToken');
        }
    }

    /**
   * Builds a MongoDB pagination filter from a nextToken (for cursor-based paging).
   */
    static buildQueryFromToken<T>(token?: string): FilterQuery<T>
    {
        if (!token) return {};

        const { updatedAt, _id } = this.decode(token);
        return {
            $or: [
                { updatedAt: { $lt: updatedAt } },
                { updatedAt, _id: { $lte: _id } },
            ],
        };
    }
}