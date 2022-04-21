import { container } from '..';

import TypeORMProductRepository from '@external/orm/repositories/type-orm-product-repository';
import TypeORMTagRepository from '@external/orm/repositories/type-orm-tag-repository';

container.register('ProductRepository', {
  useClass: TypeORMProductRepository,
});

container.register('TagRepository', {
  useClass: TypeORMTagRepository,
});
