import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import UseCase, { RequestAndResponse } from '@usecases/port/use-case';
import HttpRequest from '@adapters/controllers/port/http-request';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import GetTagByQueryController from './get-tag-by-query-controller';
import GetTagByQueryRequest from '@usecases/tag/v1/domain/get-tag-by-query-request';
import { GetTagByQueryResponse } from '@usecases/tag/v1/domain/get-tag-by-query-response';
import TagPaginationResponse from '@usecases/tag/v1/domain/tag-pagination-response';

const useCaseMock: MockProxy<
  UseCase<
    RequestAndResponse<
      GetTagByQueryRequest,
      GetTagByQueryResponse
    >
  >
> &
  UseCase<
    RequestAndResponse<
      GetTagByQueryRequest,
      GetTagByQueryResponse
    >
  > =
  mock<
    UseCase<
      RequestAndResponse<
        GetTagByQueryRequest,
        GetTagByQueryResponse
      >
    >
  >();

const makeGetTagByQueryController = () =>
  new GetTagByQueryController(useCaseMock);

describe('V1 Get Tag By Query Controller', () => {
  beforeEach(() => {
    mockReset(useCaseMock);
  });

  test('Should response 422 if invalid body when handle controller', async () => {
    const controller = makeGetTagByQueryController();
    const fields = {
      id: 'id é obrigatório',
    };
    const request: HttpRequest = {
      query: {
        id: '',
      },
    };
    const error: InvalidDataError = new InvalidDataError(fields);
    const response: GetTagByQueryResponse = {
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
    const controller = makeGetTagByQueryController();
    const request: HttpRequest = {
      query: {
        id: 'id',
      },
    };
    const tags: TagPaginationResponse = {
      data: [
        {
          id: faker.datatype.number(),
          name: faker.datatype.string(),
        }
      ],
      page_total: faker.datatype.number(),
      total: faker.datatype.number(),
      next: faker.datatype.number(),
      previous: faker.datatype.number(),
    };
    const response: GetTagByQueryResponse = {
      isLeft: jest.fn().mockReturnValue(false),
      isRight: jest.fn().mockReturnValue(true),
      value: tags,
    };

    useCaseMock.execute.mockResolvedValue(response);

    const httpResult = await controller.handle(request);

    expect(httpResult).not.toBeNull();
    expect(httpResult.statusCode).toEqual(200);
    expect(httpResult.body).toEqual(tags);
  });

  test('Should response 500 if UseCase throw error when handle controller', async () => {
    const controller = makeGetTagByQueryController();
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
