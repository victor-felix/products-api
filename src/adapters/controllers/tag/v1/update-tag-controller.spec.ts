import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import UseCase, { RequestAndResponse } from '@usecases/port/use-case';
import HttpRequest from '@adapters/controllers/port/http-request';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import UpdateTagController from './update-tag-controller';
import UpdateTagRequest from '@usecases/tag/v1/domain/update-tag-request';
import { UpdateTagResponse } from '@usecases/tag/v1/domain/update-tag-response';
import TagNotFoundError from '@usecases/errors/tag-not-found-error';
import TagResponse from '@usecases/tag/v1/domain/tag-response';

const useCaseMock: MockProxy<
  UseCase<
    RequestAndResponse<
      UpdateTagRequest,
      UpdateTagResponse
    >
  >
> &
  UseCase<
    RequestAndResponse<
      UpdateTagRequest,
      UpdateTagResponse
    >
  > =
  mock<
    UseCase<
      RequestAndResponse<
        UpdateTagRequest,
        UpdateTagResponse
      >
    >
  >();

const makeUpdateTagController = () =>
  new UpdateTagController(useCaseMock);

describe('V1 Get Tag By Query Controller', () => {
  beforeEach(() => {
    mockReset(useCaseMock);
  });

  test('Should response 422 if invalid body when handle controller', async () => {
    const controller = makeUpdateTagController();
    const fields = {
      id: 'id is required',
    };
    const request: HttpRequest = {
      params: {},
    };
    const error: InvalidDataError = new InvalidDataError(fields);
    const response: UpdateTagResponse
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

  test('Should response 400 if UseCase fail TagNotFoundError when handle controller', async () => {
    const controller = makeUpdateTagController();
    const request: HttpRequest = {
      params: { id: 1, },
    };
    const error: TagNotFoundError = new TagNotFoundError();
    const response: UpdateTagResponse = {
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
    const controller = makeUpdateTagController();
    const request: HttpRequest = {
      params: { id: 1, },
      body: { name: 'Test', tag: { name: 'test' } },
    };

    const updateTagResponse: TagResponse = {
      id: faker.datatype.number(),
      name: 'test',
    };

    const response: UpdateTagResponse = {
      isLeft: jest.fn().mockReturnValue(false),
      isRight: jest.fn().mockReturnValue(true),
      value: updateTagResponse,
    };

    useCaseMock.execute.mockResolvedValue(response);

    const httpResult = await controller.handle(request);

    expect(httpResult).not.toBeNull();
    expect(httpResult.statusCode).toEqual(200);
    expect(httpResult.body).toEqual(updateTagResponse);
  });

  test('Should response 500 if UseCase throw error when handle controller', async () => {
    const controller = makeUpdateTagController();
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
