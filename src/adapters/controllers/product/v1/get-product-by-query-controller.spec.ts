import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import UseCase, { RequestAndResponse } from '@usecases/port/use-case';
import HttpRequest from '@adapters/controllers/port/http-request';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import GetProductByQueryController from './get-product-by-query-controller';
import GetProductByQueryRequest from '@usecases/product/v1/domain/get-product-by-query-request';
import { GetProductByQueryResponse } from '@usecases/product/v1/domain/get-product-by-query-response';
import ProductPaginationResponse from '@usecases/product/v1/domain/product-pagination-response';

const useCaseMock: MockProxy<
  UseCase<
    RequestAndResponse<
      GetProductByQueryRequest,
      GetProductByQueryResponse
    >
  >
> &
  UseCase<
    RequestAndResponse<
      GetProductByQueryRequest,
      GetProductByQueryResponse
    >
  > =
  mock<
    UseCase<
      RequestAndResponse<
        GetProductByQueryRequest,
        GetProductByQueryResponse
      >
    >
  >();

const makeGetProductByQueryController = () =>
  new GetProductByQueryController(useCaseMock);

describe('V1 Get Product By Query Controller', () => {
  beforeEach(() => {
    mockReset(useCaseMock);
  });

  test('Should response 422 if invalid body when handle controller', async () => {
    const controller = makeGetProductByQueryController();
    const fields = {
      id: 'id é obrigatório',
    };
    const request: HttpRequest = {
      query: {
        id: '',
      },
    };
    const error: InvalidDataError = new InvalidDataError(fields);
    const response: GetProductByQueryResponse = {
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

  test('Should response 200 if UseCase success when handle controller', async () => {
    const controller = makeGetProductByQueryController();
    const request: HttpRequest = {
      query: {
        id: 'id',
      },
    };
    const productData: ProductPaginationResponse = {
      data: [
        {
          id: faker.datatype.number(),
          name: faker.datatype.string(),
          tag: {
            id: faker.datatype.number(),
            name: faker.datatype.string(),
          }
        }
      ],
      page_total: faker.datatype.number(),
      total: faker.datatype.number(),
      next: faker.datatype.number(),
      previous: faker.datatype.number(),
    };
    const response: GetProductByQueryResponse = {
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
    const controller = makeGetProductByQueryController();
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
