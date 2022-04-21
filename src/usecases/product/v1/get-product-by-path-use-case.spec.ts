import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import ProductRepository from './port/product-repository';
import RequestValidator from '@usecases/port/request-validator';
import ResultValidator from '@usecases/port/result-validator';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import GetProductByPathUseCase from './get-product-by-path-use-case';
import GetProductByPathRequest from './domain/get-product-by-path-request';
import GetProductByPathError from '@usecases/errors/get-product-by-path-error';
import ProductNotFoundError from '@usecases/errors/product-not-found-error';

const productRepositoryMock: MockProxy<ProductRepository> & ProductRepository = mock<ProductRepository>();

const requestValidatorMock:
  MockProxy<RequestValidator<GetProductByPathRequest>>
  & RequestValidator<GetProductByPathRequest> = mock<RequestValidator<GetProductByPathRequest>>();

const makeGetProductByPathUseCase = () => new GetProductByPathUseCase(
  requestValidatorMock,
  productRepositoryMock,
);

describe('V1 Get Product By Path Use Case', () => {
  beforeEach(() => {
    mockReset(productRepositoryMock);
    mockReset(requestValidatorMock);
  });

  test('Should throw if invalid request when the id parameter is null', async () => {
    const useCase = makeGetProductByPathUseCase();
    const request: GetProductByPathRequest = {
      id: null,
    };
    const resultValidator: ResultValidator<GetProductByPathRequest> = {
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
    const useCase = makeGetProductByPathUseCase();
    const request: GetProductByPathRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<GetProductByPathRequest> = {
      isValid: true,
      fields: { ...request },
    };

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    productRepositoryMock.findById.mockResolvedValue(undefined);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(new ProductNotFoundError());
  });

  test('Should throw error when use case fail', async () => {
    const useCase = makeGetProductByPathUseCase();
    const request: GetProductByPathRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<GetProductByPathRequest> = {
      isValid: true,
      value: request,
    };
    const error = new Error('Any Error.');

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    productRepositoryMock.findById.mockRejectedValue(error);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(new GetProductByPathError(error));
  });

  test('Should return response when use case success', async () => {
    const useCase = makeGetProductByPathUseCase();
    const request: GetProductByPathRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<GetProductByPathRequest> = {
      isValid: true,
      value: request,
    };

    const product = {
      id: request.id,
      name: faker.datatype.string(),
    };

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    productRepositoryMock.findById.mockResolvedValue(product);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(false);
    expect(response.isRight()).toBe(true);
    expect(response.value).toEqual(product);
  });
});
