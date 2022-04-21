import { EntitySchema } from 'typeorm';
import Product from '@entities/product';
import { BaseColumnSchema } from './base-column-schema';

export const ProductEntity = new EntitySchema<Product>({
  name: 'product',
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
    tag: {
      type: 'many-to-one',
      target: 'tag',
      joinColumn: { name: 'tag_id', referencedColumnName: 'id' },
      inverseSide: 'products'
    },
  },
});
