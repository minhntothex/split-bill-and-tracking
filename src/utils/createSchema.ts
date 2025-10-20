import { SchemaFactory } from '@nestjs/mongoose';

// import { updatedAtPlugin } from 'plugin';

export function createSchema<T>(cls: new () => T)
{
    const schema = SchemaFactory.createForClass(cls);
    // schema.plugin(updatedAtPlugin);

    return schema;
}