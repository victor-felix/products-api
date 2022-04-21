import { containerV1 } from '..';

import CreateProductController from '@adapters/controllers/product/v1/create-product-controller';
import DeleteProductByPathController from '@adapters/controllers/product/v1/delete-product-by-path-controller';
import GetProductByPathController from '@adapters/controllers/product/v1/get-product-by-path-controller';
import GetProductByQueryController from '@adapters/controllers/product/v1/get-product-by-query-controller';
import UpdateProductController from '@adapters/controllers/product/v1/update-product-controller';
import CreateProductRequestValidator from '@external/validations/product/v1/create-product-request-validator';
import CreateProductUseCase from '@usecases/product/v1/create-product-use-case';
import DeleteProductUseCase from '@usecases/product/v1/delete-product-use-case';
import DeleteProductRequestValidator from '@external/validations/product/v1/delete-product-request-validator';
import UpdateProductRequestValidator from '@external/validations/product/v1/update-product-request-validator';
import GetProductByPathUseCase from '@usecases/product/v1/get-product-by-path-use-case';
import UpdateProductUseCase from '@usecases/product/v1/update-product-use-case';
import GetProductByQueryUseCase from '@usecases/product/v1/get-product-by-query-use-case';
import GetProductByPathRequestValidator from '@external/validations/product/v1/get-product-by-path-request-validator';
import GetProductByQueryRequestValidator from '@external/validations/product/v1/get-product-by-query-request-validator';
import CreateTagUseCase from '@usecases/tag/v1/create-tag-use-case';
import DeleteTagUseCase from '@usecases/tag/v1/delete-tag-use-case';
import GetTagByPathUseCase from '@usecases/tag/v1/get-tag-by-path-use-case';
import GetTagByQueryUseCase from '@usecases/tag/v1/get-tag-by-query-use-case';
import UpdateTagUseCase from '@usecases/tag/v1/update-tag-use-case';
import CreateTagRequestValidator from '@external/validations/tag/v1/create-tag-request-validator';
import DeleteTagRequestValidator from '@external/validations/tag/v1/delete-tag-request-validator';
import UpdateTagRequestValidator from '@external/validations/tag/v1/update-tag-request-validator';
import GetTagByPathRequestValidator from '@external/validations/tag/v1/get-tag-by-path-request-validator';
import GetTagByQueryRequestValidator from '@external/validations/tag/v1/get-tag-by-query-request-validator';
import CreateTagController from '@adapters/controllers/tag/v1/create-tag-controller';
import DeleteTagByPathController from '@adapters/controllers/tag/v1/delete-tag-by-path-controller';
import GetTagByPathController from '@adapters/controllers/tag/v1/get-tag-by-path-controller';
import GetTagByQueryController from '@adapters/controllers/tag/v1/get-tag-by-query-controller';
import UpdateTagController from '@adapters/controllers/tag/v1/update-tag-controller';
import ExportJsonTagProductsByPathController from '@adapters/controllers/tag/v1/export-tag-products-by-path-controller';
import ExportJsonTagProductsByPathValidator from '@external/validations/tag/v1/export-tag-products-by-path-validator';
import ExportJsonTagProductsByPathUseCase from '@usecases/tag/v1/export-tag-products-by-path-use-case';
import ImportJsonTagProductsByPathController from '@adapters/controllers/tag/v1/import-tag-products-by-path-controller';
import ImportJsonTagProductsByPathValidator from '@external/validations/tag/v1/import-tag-products-by-path-validator';
import ImportJsonTagProductsByPathUseCase from '@usecases/tag/v1/import-tag-products-by-path-use-case';


containerV1.register('CreateProductUseCase', {
  useClass: CreateProductUseCase,
});
containerV1.register('DeleteProductUseCase', {
  useClass: DeleteProductUseCase,
});
containerV1.register('GetProductByPathUseCase', {
  useClass: GetProductByPathUseCase,
});
containerV1.register('GetProductByQueryUseCase', {
  useClass: GetProductByQueryUseCase,
});
containerV1.register('UpdateProductUseCase', {
  useClass: UpdateProductUseCase,
});
containerV1.register('CreateProductRequestValidator', {
  useClass: CreateProductRequestValidator,
});
containerV1.register('DeleteProductRequestValidator', {
  useClass: DeleteProductRequestValidator,
});
containerV1.register('UpdateProductRequestValidator', {
  useClass: UpdateProductRequestValidator,
});
containerV1.register('GetProductByPathRequestValidator', {
  useClass: GetProductByPathRequestValidator,
});
containerV1.register('GetProductByQueryRequestValidator', {
  useClass: GetProductByQueryRequestValidator,
});
containerV1.register('CreateTagUseCase', {
  useClass: CreateTagUseCase,
});
containerV1.register('DeleteTagUseCase', {
  useClass: DeleteTagUseCase,
});
containerV1.register('GetTagByPathUseCase', {
  useClass: GetTagByPathUseCase,
});
containerV1.register('GetTagByQueryUseCase', {
  useClass: GetTagByQueryUseCase,
});
containerV1.register('UpdateTagUseCase', {
  useClass: UpdateTagUseCase,
});
containerV1.register('ExportJsonTagProductsByPathUseCase', {
  useClass: ExportJsonTagProductsByPathUseCase,
});
containerV1.register('ImportJsonTagProductsByPathUseCase', {
  useClass: ImportJsonTagProductsByPathUseCase,
});
containerV1.register('CreateTagRequestValidator', {
  useClass: CreateTagRequestValidator,
});
containerV1.register('DeleteTagRequestValidator', {
  useClass: DeleteTagRequestValidator,
});
containerV1.register('UpdateTagRequestValidator', {
  useClass: UpdateTagRequestValidator,
});
containerV1.register('GetTagByPathRequestValidator', {
  useClass: GetTagByPathRequestValidator,
});
containerV1.register('GetTagByQueryRequestValidator', {
  useClass: GetTagByQueryRequestValidator,
});
containerV1.register('ExportJsonTagProductsByPathValidator', {
  useClass: ExportJsonTagProductsByPathValidator,
});
containerV1.register('ImportJsonTagProductsByPathValidator', {
  useClass: ImportJsonTagProductsByPathValidator,
});

containerV1.register('CreateProductController', { useClass: CreateProductController });
containerV1.register('DeleteProductByPathController', { useClass: DeleteProductByPathController });
containerV1.register('GetProductByPathController', { useClass: GetProductByPathController });
containerV1.register('GetProductByQueryController', { useClass: GetProductByQueryController });
containerV1.register('UpdateProductController', { useClass: UpdateProductController });
containerV1.register('CreateTagController', { useClass: CreateTagController });
containerV1.register('DeleteTagByPathController', { useClass: DeleteTagByPathController });
containerV1.register('GetTagByPathController', { useClass: GetTagByPathController });
containerV1.register('GetTagByQueryController', { useClass: GetTagByQueryController });
containerV1.register('UpdateTagController', { useClass: UpdateTagController });
containerV1.register('ExportJsonTagProductsByPathController', { useClass: ExportJsonTagProductsByPathController });
containerV1.register('ImportJsonTagProductsByPathController', { useClass: ImportJsonTagProductsByPathController });
