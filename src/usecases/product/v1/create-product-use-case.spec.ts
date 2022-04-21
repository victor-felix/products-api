import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import ProductRepository from './port/product-repository';
import CreateProductRequest from './domain/create-product-request';
import RequestValidator from '@usecases/port/request-validator';
import TagRepository from '@usecases/tag/v1/port/tag-repository';
import CreateProductUseCase from './create-product-use-case';
import ResultValidator from '@usecases/port/result-validator';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import CreateProductError from '@usecases/errors/create-product-error';
import Tag from '@entities/tag';
import Product from '@entities/product';

const productRepositoryMock: MockProxy<ProductRepository> & ProductRepository = mock<ProductRepository>();
const tagRepositoryMock: MockProxy<TagRepository> & TagRepository = mock<TagRepository>();

const requestValidatorMock:
  MockProxy<RequestValidator<CreateProductRequest>>
  & RequestValidator<CreateProductRequest> = mock<RequestValidator<CreateProductRequest>>();

const makeCreateProductUseCase = () => new CreateProductUseCase(
  requestValidatorMock,
  productRepositoryMock,
  tagRepositoryMock,
);

describe('V1 Create Product Use Case', () => {
  beforeEach(() => {
    mockReset(tagRepositoryMock);
    mockReset(productRepositoryMock);
    mockReset(requestValidatorMock);
  })

  test('Should throw if invalid request when empty data', async () => {
    const useCase = makeCreateProductUseCase();
    const request: CreateProductRequest = {
      name: '',
      tag: {
        name: '',
      }
    };
    const resultValidator: ResultValidator<CreateProductRequest> = {
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

  test('Should throw error when use case fail', async () => {
    const useCase = makeCreateProductUseCase();
    const request: CreateProductRequest = {
      name: faker.datatype.string(),
      tag: {
        name: faker.datatype.string(),
      }
    };
    const resultValidator: ResultValidator<CreateProductRequest> = {
      isValid: true,
      value: request,
    };
    const error = new Error('Any Error.');

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    tagRepositoryMock.findByName.mockRejectedValue(error);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(new CreateProductError(error));
  });

  test('Should return response when tag not exists and use case success', async () => {
    const useCase = makeCreateProductUseCase();
    const request: CreateProductRequest = {
      name: faker.datatype.string(),
      tag: {
        name: faker.datatype.string(),
      }
    };
    const resultValidator: ResultValidator<CreateProductRequest> = {
      isValid: true,
      value: request,
    };
    const createdTag: Tag = {
      id: faker.datatype.number(),
      name: request.tag.name,
    };
    const createdProduct: Product = {
      id: faker.datatype.number(),
      name: request.name,
      tag: createdTag,
    };


    requestValidatorMock.validate.mockReturnValue(resultValidator);
    tagRepositoryMock.findByName.mockResolvedValue(undefined);
    tagRepositoryMock.save.mockResolvedValue(createdTag);
    productRepositoryMock.save.mockResolvedValue(createdProduct);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(false);
    expect(response.isRight()).toBe(true);
    expect(response.value).toEqual(createdProduct);
  });
});
