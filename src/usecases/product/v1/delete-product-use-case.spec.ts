import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import ProductRepository from './port/product-repository';
import RequestValidator from '@usecases/port/request-validator';
import ResultValidator from '@usecases/port/result-validator';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import DeleteProductUseCase from './delete-product-use-case';
import DeleteProductRequest from './domain/delete-product-request';
import ProductNotFoundError from '@usecases/errors/product-not-found-error';
import DeleteProductError from '@usecases/errors/delete-product-error';

const productRepositoryMock: MockProxy<ProductRepository> & ProductRepository = mock<ProductRepository>();

const requestValidatorMock:
  MockProxy<RequestValidator<DeleteProductRequest>>
  & RequestValidator<DeleteProductRequest> = mock<RequestValidator<DeleteProductRequest>>();

const makeDeleteProductUseCase = () => new DeleteProductUseCase(
  requestValidatorMock,
  productRepositoryMock,
);

describe('V1 Delete Product Use Case', () => {
  beforeEach(() => {
    mockReset(productRepositoryMock);
    mockReset(requestValidatorMock);
  });

  test('Should throw if invalid request when the id parameter is null', async () => {
    const useCase = makeDeleteProductUseCase();
    const request: DeleteProductRequest = {
      id: null,
    };
    const resultValidator: ResultValidator<DeleteProductRequest> = {
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
    const useCase = makeDeleteProductUseCase();
    const request: DeleteProductRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<DeleteProductRequest> = {
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
    const useCase = makeDeleteProductUseCase();
    const request: DeleteProductRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<DeleteProductRequest> = {
      isValid: true,
      value: request,
    };
    const error = new Error('Any Error.');

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    productRepositoryMock.findById.mockRejectedValue(error);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(new DeleteProductError(error));
  });

  test('Should return response when use case success', async () => {
    const useCase = makeDeleteProductUseCase();
    const request: DeleteProductRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<DeleteProductRequest> = {
      isValid: true,
      value: request,
    };

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    productRepositoryMock.findById.mockResolvedValue({
      id: request.id,
      name: faker.datatype.string(),
    });
    productRepositoryMock.delete.mockResolvedValue();

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(false);
    expect(response.isRight()).toBe(true);
    expect(response.value).toEqual(null);
  });
});
