import z from 'zod';

import { flatMapParseOrDiscard } from '../../flatMapParseOrDiscard';

describe('flatMapParseOrDiscard', () =>
{
    const schema = z.object({ name: z.string(), age: z.number().min(1), gender: z.enum(['male', 'female']) });

    it('keeps all valid items', () => 
    {
        const people = [
            { name: 'Alice', age: 25, gender: 'female' },
            { name: 'Bob', age: 30, gender: 'male' },
            { name: 'Charlie', age: 35, gender: 'male' },
        ];

        const result = people.flatMap(flatMapParseOrDiscard(schema));
        expect(result).toEqual(people);
    });

    it('discards invalid items', () =>
    {
        const people = [
            { name: 'Alice', age: 25, gender: 'female' },
            { name: 'Bob', age: 30, gender: 'unknown' },
            { name: 'Charlie', age: 35, gender: 'male' },
            { name: 'Dave', age: 0, gender: 'male' },
            { age: 40, gender: 'female' },
        ];

        const result = people.flatMap(flatMapParseOrDiscard(schema));
        expect(result).toEqual([
            { name: 'Alice', age: 25, gender: 'female' },
            { name: 'Charlie', age: 35, gender: 'male' },
        ]);
    });
});