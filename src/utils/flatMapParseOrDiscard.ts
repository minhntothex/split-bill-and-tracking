import z from 'zod';

export function flatMapParseOrDiscard<T extends z.ZodType>(schema: T)
{
    return function (item: unknown): z.infer<T> | []
    {
        const { success, data, error } = schema.safeParse(item);
        if (success)
        {
            return data;
        }

        const { errors } = z.treeifyError(error);
        console.warn(errors[0]);

        return [];
    };
}