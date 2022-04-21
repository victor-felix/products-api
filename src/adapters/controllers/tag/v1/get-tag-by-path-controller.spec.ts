import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import UseCase, { RequestAndResponse } from '@usecases/port/use-case';
import HttpRequest from '@adapters/controllers/port/http-request';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import GetTagByPathController from './get-tag-by-path-controller';
import GetTagByPathRequest from '@usecases/tag/v1/domain/get-tag-by-path-request';
import { GetTagByPathResponse } from '@usecases/tag/v1/domain/get-tag-by-path-response';
import TagResponse from '@usecases/tag/v1/domain/tag-response';
import TagNotFoundError from '@usecases/errors/tag-not-found-error';

const useCaseMock: MockProxy<
  UseCase<
    RequestAndResponse<
      GetTagByPathRequest,
      GetTagByPathResponse
    >
  >
> &
  UseCase<
    RequestAndResponse<
      GetTagByPathRequest,
      GetTagByPathResponse
    >
  > =
  mock<
    UseCase<
      RequestAndResponse<
        GetTagByPathRequest,
        GetTagByPathResponse
      >
    >
  >();

const makeGetTagByPathController = () =>
  new GetTagByPathController(useCaseMock);

describe('V1 Get Tag By Path Controller', () => {
  beforeEach(() => {
    mockReset(useCaseMock);
  });

  test('Should response 422 if invalid body when handle controller', async () => {
    const controller = makeGetTagByPathController();
    const fields = {
      id: 'id is required',
    };
    const request: HttpRequest = {
      params: {},
    };
    const error: InvalidDataError = new InvalidDataError(fields);
    const response: GetTagByPathResponse = {
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
    const controller = makeGetTagByPathController();
    const request: HttpRequest = {
      params: {},
    };
    const error: TagNotFoundError = new TagNotFoundError();
    const response: GetTagByPathResponse = {
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
    const controller = makeGetTagByPathController();
    const request: HttpRequest = {
      query: {
        id: 'id',
      },
    };
    const tagData: TagResponse = {
      id: faker.datatype.number(),
      name: faker.datatype.string(),
    };
    const response: GetTagByPathResponse = {
      isLeft: jest.fn().mockReturnValue(false),
      isRight: jest.fn().mockReturnValue(true),
      value: tagData,
    };

    useCaseMock.execute.mockResolvedValue(response);

    const httpResult = await controller.handle(request);

    expect(httpResult).not.toBeNull();
    expect(httpResult.statusCode).toEqual(200);
    expect(httpResult.body).toEqual(tagData);
  });

  test('Should response 500 if UseCase throw error when handle controller', async () => {
    const controller = makeGetTagByPathController();
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
