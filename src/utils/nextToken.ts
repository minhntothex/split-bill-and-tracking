import { FilterQuery, Types } from 'mongoose';
import { z } from 'zod';

const NextTokenPayload = z.object({
    updatedAt: z.iso.datetime(),
    id: z.string().refine(val => Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId',
    }),
});

export type NextTokenPayload = z.infer<typeof NextTokenPayload>;

export class NextToken 
{
    /**
     * Encode a payload into a Base64 token string.
    */
    static encode(payload: NextTokenPayload): string 
    {
        const json = JSON.stringify(payload);
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
            const parsed: unknown = JSON.parse(json);
            return NextTokenPayload.parse(parsed);
        }
        catch 
        {
            throw new Error('Invalid or malformed nextToken');
        }
    }

    /**
     * Generate a token from a Mongoose document.
     */
    static fromDocument(doc: { _id: Types.ObjectId; updatedAt: Date }): string 
    {
        return this.encode({
            id: doc._id.toString(),
            updatedAt: doc.updatedAt.toISOString(),
        });
    }

    /**
   * Builds a MongoDB pagination filter from a nextToken (for cursor-based paging).
   */
    static buildQueryFromToken(token?: undefined): undefined
    static buildQueryFromToken<T>(token: string): FilterQuery<T>
    static buildQueryFromToken<T>(token?: string): FilterQuery<T> | undefined
    {
        if (!token) return {};

        const { updatedAt, id } = this.decode(token);
        return {
            $or: [
                { updatedAt: { $lt: updatedAt } },
                { updatedAt, _id: { $lte: new Types.ObjectId(id) } },
            ],
        };
    }
}