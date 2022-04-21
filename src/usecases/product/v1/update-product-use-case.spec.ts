import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import ProductRepository from './port/product-repository';
import RequestValidator from '@usecases/port/request-validator';
import ResultValidator from '@usecases/port/result-validator';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import UpdateProductRequest from './domain/update-product-request';
import UpdateProductUseCase from './update-product-use-case';
import TagRepository from '@usecases/tag/v1/port/tag-repository';
import Tag from '@entities/tag';
import Product from '@entities/product';
import ProductNotFoundError from '@usecases/errors/product-not-found-error';
import UpdateProductError from '@usecases/errors/update-product-error';

const productRepositoryMock: MockProxy<ProductRepository> & ProductRepository = mock<ProductRepository>();
const tagRepositoryMock: MockProxy<TagRepository> & TagRepository = mock<TagRepository>();

const requestValidatorMock:
  MockProxy<RequestValidator<UpdateProductRequest>>
  & RequestValidator<UpdateProductRequest> = mock<RequestValidator<UpdateProductRequest>>();

const makeUpdateProductUseCase = () => new UpdateProductUseCase(
  requestValidatorMock,
  productRepositoryMock,
  tagRepositoryMock
);

describe('V1 Update Product Use Case', () => {
  beforeEach(() => {
    mockReset(productRepositoryMock);
    mockReset(requestValidatorMock);
  });

  test('Should throw if invalid request when the id parameter is null', async () => {
    const useCase = makeUpdateProductUseCase();
    const request: UpdateProductRequest = {
      id: null,
      name: faker.datatype.string(),
    };
    const resultValidator: ResultValidator<UpdateProductRequest> = {
      isValid: false,
      fields: { ...request },
    };

    requestValidatorMock.validate.mockReturnValue(resultValidator);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(
      new InvalidDataError(resultValidator.fields),
    );
  });

  test('Should throw if product not found', async () => {
    const useCase = makeUpdateProductUseCase();
    const request: UpdateProductRequest = {
      id: faker.datatype.number(),
      name: faker.datatype.string(),
    };
    const resultValidator: ResultValidator<UpdateProductRequest> = {
      isValid: true,
      fields: { ...request },
    };

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    productRepositoryMock.findById.mockResolvedValue(undefined);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(
      new ProductNotFoundError(),
    );
  });

  test('Should throw error when use case fail', async () => {
    const useCase = makeUpdateProductUseCase();
    const request: UpdateProductRequest = {
      id: faker.datatype.number(),
      name: faker.datatype.string(),
    };
    const resultValidator: ResultValidator<UpdateProductRequest> = {
      isValid: true,
      value: request,
    };
    const error = new Error('Any Error.');

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    productRepositoryMock.findById.mockRejectedValue(error);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(new UpdateProductError(error));
  });

  test('Should return response when tag not exists and use case success', async () => {
    const useCase = makeUpdateProductUseCase();
    const request: UpdateProductRequest = {
      id: faker.datatype.number(),
      name: faker.datatype.string(),
      tag: {
        name: faker.datatype.string(),
      }
    };
    const resultValidator: ResultValidator<UpdateProductRequest> = {
      isValid: true,
      value: request,
    };
    const createdTag: Tag = {
      id: faker.datatype.number(),
      name: request.tag.name,
    };
    const updatedProduct: Product = {
      id: request.id,
      name: request.name,
      tag: createdTag,
    };

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    productRepositoryMock.findById.mockResolvedValue({
      id: faker.datatype.number(),
      name: faker.datatype.string(),
    });
    tagRepositoryMock.findByName.mockResolvedValue(undefined);
    tagRepositoryMock.save.mockResolvedValue(createdTag);
    productRepositoryMock.save.mockResolvedValue(updatedProduct);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(false);
    expect(response.isRight()).toBe(true);
    expect(response.value).toEqual(updatedProduct);
  });
});
