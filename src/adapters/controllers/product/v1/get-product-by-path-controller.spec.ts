import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import UseCase, { RequestAndResponse } from '@usecases/port/use-case';
import HttpRequest from '@adapters/controllers/port/http-request';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import GetProductByPathController from './get-product-by-path-controller';
import GetProductByPathRequest from '@usecases/product/v1/domain/get-product-by-path-request';
import { GetProductByPathResponse } from '@usecases/product/v1/domain/get-product-by-path-response';
import ProductResponse from '@usecases/product/v1/domain/product-response';
import ProductNotFoundError from '@usecases/errors/product-not-found-error';

const useCaseMock: MockProxy<
  UseCase<
    RequestAndResponse<
      GetProductByPathRequest,
      GetProductByPathResponse
    >
  >
> &
  UseCase<
    RequestAndResponse<
      GetProductByPathRequest,
      GetProductByPathResponse
    >
  > =
  mock<
    UseCase<
      RequestAndResponse<
        GetProductByPathRequest,
        GetProductByPathResponse
      >
    >
  >();

const makeGetProductByPathController = () =>
  new GetProductByPathController(useCaseMock);

describe('V1 Get Product By Path Controller', () => {
  beforeEach(() => {
    mockReset(useCaseMock);
  });

  test('Should response 422 if invalid body when handle controller', async () => {
    const controller = makeGetProductByPathController();
    const fields = {
      id: 'id is required',
    };
    const request: HttpRequest = {
      params: {},
    };
    const error: InvalidDataError = new InvalidDataError(fields);
    const response: GetProductByPathResponse = {
      isLeft: jest.fn().mockReturnValue(true),
      isRight: jest.fn().mockReturnValue(false),
      value: error,
    };

    useCaseMock.execute.mockResolvedValue(response);

    const httpResult = await controller.handle(request);

    expect(httpResult).not.toBeNull();
    expect(httpResult.statusCode).toEqual(422);
    expect(httpResult.body).toEqual(fields);
  });

  test('Should response 404 if tag not found', async () => {
    const controller = makeGetProductByPathController();
    const request: HttpRequest = {
      params: {},
    };
    const error: ProductNotFoundError = new ProductNotFoundError();
    const response: GetProductByPathResponse = {
      isLeft: jest.fn().mockReturnValue(true),
      isRight: jest.fn().mockReturnValue(false),
      value: error,
    };

    useCaseMock.execute.mockResolvedValue(response);

    const httpResult = await controller.handle(request);

    expect(httpResult).not.toBeNull();
    expect(httpResult.statusCode).toEqual(404);
    expect(httpResult.body).toEqual(error.message);
  });

  test('Should response 200 if UseCase success when handle controller', async () => {
    const controller = makeGetProductByPathController();
    const request: HttpRequest = {
      query: {
        id: 'id',
      },
    };
    const productData: ProductResponse = {
        id: faker.datatype.number(),
        name: faker.datatype.string(),
        tag: {
          id: faker.datatype.number(),
          name: faker.datatype.string(),
        }
    };
    const response: GetProductByPathResponse = {
      isLeft: jest.fn().mockReturnValue(false),
      isRight: jest.fn().mockReturnValue(true),
      value: productData,
    };

    useCaseMock.execute.mockResolvedValue(response);

    const httpResult = await controller.handle(request);

    expect(httpResult).not.toBeNull();
    expect(httpResult.statusCode).toEqual(200);
    expect(httpResult.body).toEqual(productData);
  });

  test('Should response 500 if UseCase throw error when handle controller', async () => {
    const controller = makeGetProductByPathController();
    const request: HttpRequest = {
      params: { id: 1 },
    };
    const error: Error = new Error('Any Error');

    useCaseMock.execute.mockRejectedValue(error);

    const response = await controller.handle(request);

    expect(response).not.toBeNull();
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual('Internal error');
  });
});
