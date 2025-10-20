import { Schema } from 'mongoose';

/**
 * A plugin attachs a middleware which updates `updatedAt` automatically
 * @param schema Mongoose schema
 */
export function updatedAtPlugin(schema: Schema)
{
    if (!schema.get('timestamps'))
    {
        schema.set('timestamps', true);
    }

    const UPDATE_METHODS = ['updateOne', 'updateMany', 'findOneAndUpdate'] as const;
    UPDATE_METHODS.forEach(method => 
    {
        schema.pre(method, function (next)
        {
            this.set({ updatedAt: new Date() });
            next();
        });
    });
}