import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import UseCase, { RequestAndResponse } from '@usecases/port/use-case';
import HttpRequest from '@adapters/controllers/port/http-request';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import UpdateProductController from './update-product-controller';
import UpdateProductRequest from '@usecases/product/v1/domain/update-product-request';
import { UpdateProductResponse } from '@usecases/product/v1/domain/update-product-response';
import ProductNotFoundError from '@usecases/errors/product-not-found-error';
import ProductResponse from '@usecases/product/v1/domain/product-response';

const useCaseMock: MockProxy<
  UseCase<
    RequestAndResponse<
      UpdateProductRequest,
      UpdateProductResponse
    >
  >
> &
  UseCase<
    RequestAndResponse<
      UpdateProductRequest,
      UpdateProductResponse
    >
  > =
  mock<
    UseCase<
      RequestAndResponse<
        UpdateProductRequest,
        UpdateProductResponse
      >
    >
  >();

const makeUpdateProductController = () =>
  new UpdateProductController(useCaseMock);

describe('V1 Get Product By Query Controller', () => {
  beforeEach(() => {
    mockReset(useCaseMock);
  });

  test('Should response 422 if invalid body when handle controller', async () => {
    const controller = makeUpdateProductController();
    const fields = {
      id: 'id is required',
    };
    const request: HttpRequest = {
      params: {},
    };
    const error: InvalidDataError = new InvalidDataError(fields);
    const response: UpdateProductResponse
     = {
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

  test('Should response 400 if UseCase fail ProductNotFoundError when handle controller', async () => {
    const controller = makeUpdateProductController();
    const request: HttpRequest = {
      params: { id: 1, },
    };
    const error: ProductNotFoundError = new ProductNotFoundError();
    const response: UpdateProductResponse = {
      isLeft: jest.fn().mockReturnValue(true),
      isRight: jest.fn().mockReturnValue(false),
      value: error,
    };

    useCaseMock.execute.mockResolvedValue(response);

    const httpResult = await controller.handle(request);

    expect(httpResult).not.toBeNull();
    expect(httpResult.statusCode).toEqual(400);
    expect(httpResult.body).toEqual(error.message);
  });

  test('Should response 200 if UseCase success when handle controller', async () => {
    const controller = makeUpdateProductController();
    const request: HttpRequest = {
      params: { id: 1, },
      body: { name: 'Test', tag: { name: 'test' } },
    };

    const updateProductResponse: ProductResponse = {
      id: faker.datatype.number(),
      name: 'Test',
      tag: {
        id: faker.datatype.number(),
        name: 'test',
      }
    };

    const response: UpdateProductResponse = {
      isLeft: jest.fn().mockReturnValue(false),
      isRight: jest.fn().mockReturnValue(true),
      value: updateProductResponse,
    };

    useCaseMock.execute.mockResolvedValue(response);

    const httpResult = await controller.handle(request);

    expect(httpResult).not.toBeNull();
    expect(httpResult.statusCode).toEqual(200);
    expect(httpResult.body).toEqual(updateProductResponse);
  });

  test('Should response 500 if UseCase throw error when handle controller', async () => {
    const controller = makeUpdateProductController();
    const request: HttpRequest = {
      body: { name: 'Test', tag: { name: 'test' } },
    };
    const error: Error = new Error('Any Error');

    useCaseMock.execute.mockRejectedValue(error);

    const response = await controller.handle(request);

    expect(response).not.toBeNull();
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual('Internal error');
  });
});
