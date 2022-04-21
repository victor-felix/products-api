import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import ProductRepository from './port/product-repository';
import RequestValidator from '@usecases/port/request-validator';
import ResultValidator from '@usecases/port/result-validator';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import GetProductByQueryUseCase from './get-product-by-query-use-case';
import GetProductByQueryRequest from './domain/get-product-by-query-request';
import GetProductByQueryError from '@usecases/errors/get-product-by-query-error';
import ProductPaginationResponse from './domain/product-pagination-response';

const productRepositoryMock: MockProxy<ProductRepository> & ProductRepository = mock<ProductRepository>();

const requestValidatorMock:
  MockProxy<RequestValidator<GetProductByQueryRequest>>
  & RequestValidator<GetProductByQueryRequest> = mock<RequestValidator<GetProductByQueryRequest>>();

const makeGetProductByQueryUseCase = () => new GetProductByQueryUseCase(
  requestValidatorMock,
  productRepositoryMock,
);

describe('V1 Get Product By Query Use Case', () => {
  beforeEach(() => {
    mockReset(productRepositoryMock);
    mockReset(requestValidatorMock);
  });

  test('Should throw if invalid request when the id parameter is null', async () => {
    const useCase = makeGetProductByQueryUseCase();
    const request: GetProductByQueryRequest = {
      id: null,
    };
    const resultValidator: ResultValidator<GetProductByQueryRequest> = {
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
    const useCase = makeGetProductByQueryUseCase();
    const request: GetProductByQueryRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<GetProductByQueryRequest> = {
      isValid: true,
      value: request,
    };
    const error = new Error('Any Error.');

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    productRepositoryMock.query.mockRejectedValue(error);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(new GetProductByQueryError(error));
  });

  test('Should return response when use case success', async () => {
    const useCase = makeGetProductByQueryUseCase();
    const request: GetProductByQueryRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<GetProductByQueryRequest> = {
      isValid: true,
      value: request,
    };
    const product = {
      id: request.id,
      name: faker.datatype.string(),
    };
    const dataProducts = {
      data: [product],
      page_total: faker.datatype.number(),
      total: faker.datatype.number(),
      next: faker.datatype.number(),
      previous: faker.datatype.number(),
    } as ProductPaginationResponse;

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    productRepositoryMock.query.mockResolvedValue(dataProducts);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(false);
    expect(response.isRight()).toBe(true);
    expect(response.value).toEqual(dataProducts);
  });
});
