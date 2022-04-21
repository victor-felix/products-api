import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import UseCase, { RequestAndResponse } from '@usecases/port/use-case';
import HttpRequest from '@adapters/controllers/port/http-request';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import CreateProductRequest from '@usecases/product/v1/domain/create-product-request';
import { CreateProductResponse } from '@usecases/product/v1/domain/create-product-response';
import CreateProductController from './create-product-controller';
import CreateProductError from '@usecases/errors/create-product-error';
import ProductResponse from '@usecases/product/v1/domain/product-response';

const useCaseMock: MockProxy<
  UseCase<
    RequestAndResponse<
      CreateProductRequest,
      CreateProductResponse
    >
  >
> &
  UseCase<
    RequestAndResponse<
      CreateProductRequest,
      CreateProductResponse
    >
  > =
  mock<
    UseCase<
      RequestAndResponse<
        CreateProductRequest,
        CreateProductResponse
      >
    >
  >();

const makeCreateProductController = () =>
  new CreateProductController(useCaseMock);

describe('V1 Create Product Controller', () => {
  beforeEach(() => {
    mockReset(useCaseMock);
  });

  test('Should response 422 if invalid body when handle controller', async () => {
    const controller = makeCreateProductController();
    const fields = {
      tag: 'tag is required',
    };
    const request: HttpRequest = {
      body: { name: 'Test' },
    };
    const error: InvalidDataError = new InvalidDataError(fields);
    const response: CreateProductResponse = {
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

  test('Should response 400 if UseCase fail CreateProductError when handle controller', async () => {
    const controller = makeCreateProductController();
    const request: HttpRequest = {
      body: { name: 'Test' },
    };
    const error: CreateProductError = new CreateProductError(
      new Error('Any Error'),
    );
    const response: CreateProductResponse = {
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
    const controller = makeCreateProductController();
    const request: HttpRequest = {
      body: { name: 'Test', tag: { name: 'test' } },
    };

    const createProductResponse: ProductResponse = {
      id: faker.datatype.number(),
      name: 'Test',
      tag: {
        id: faker.datatype.number(),
        name: 'test',
      }
    };

    const response: CreateProductResponse = {
      isLeft: jest.fn().mockReturnValue(false),
      isRight: jest.fn().mockReturnValue(true),
      value: createProductResponse,
    };

    useCaseMock.execute.mockResolvedValue(response);

    const httpResult = await controller.handle(request);

    expect(httpResult).not.toBeNull();
    expect(httpResult.statusCode).toEqual(201);
    expect(httpResult.body).toEqual(createProductResponse);
  });

  test('Should response 500 if UseCase throw error when handle controller', async () => {
    const controller = makeCreateProductController();
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
