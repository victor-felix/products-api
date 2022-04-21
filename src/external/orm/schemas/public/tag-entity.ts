import { EntitySchema } from 'typeorm';
import Tag from '@entities/tag';
import { BaseColumnSchema } from './base-column-schema';

export const TagEntity = new EntitySchema<Tag>({
  name: 'tag',
  columns: {
    id: {
      type: Number,
      primary: true,
      name: 'id',
      nullable: false,
      generated: true,
    },
    name: {
      type: 'varchar',
      name: 'name',
      nullable: false,
      length: 128,
    },
    ...BaseColumnSchema,
  },
  relations: {
    products: {
      type: 'one-to-many',
      target: 'product',
      cascade: true,
      inverseSide: 'tag'
    },
  },
});
