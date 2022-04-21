import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import UseCase, { RequestAndResponse } from '@usecases/port/use-case';
import HttpRequest from '@adapters/controllers/port/http-request';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import CreateTagRequest from '@usecases/tag/v1/domain/create-tag-request';
import { CreateTagResponse } from '@usecases/tag/v1/domain/create-tag-response';
import CreateTagController from './create-tag-controller';
import CreateTagError from '@usecases/errors/create-tag-error';
import TagResponse from '@usecases/tag/v1/domain/tag-response';

const useCaseMock: MockProxy<
  UseCase<
    RequestAndResponse<
      CreateTagRequest,
      CreateTagResponse
    >
  >
> &
  UseCase<
    RequestAndResponse<
      CreateTagRequest,
      CreateTagResponse
    >
  > =
  mock<
    UseCase<
      RequestAndResponse<
        CreateTagRequest,
        CreateTagResponse
      >
    >
  >();

const makeCreateTagController = () =>
  new CreateTagController(useCaseMock);

describe('V1 Create Tag Controller', () => {
  beforeEach(() => {
    mockReset(useCaseMock);
  });

  test('Should response 422 if invalid body when handle controller', async () => {
    const controller = makeCreateTagController();
    const fields = {
      tag: 'tag is required',
    };
    const request: HttpRequest = {
      body: { name: 'Test' },
    };
    const error: InvalidDataError = new InvalidDataError(fields);
    const response: CreateTagResponse = {
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

  test('Should response 400 if UseCase fail CreateTagError when handle controller', async () => {
    const controller = makeCreateTagController();
    const request: HttpRequest = {
      body: { name: 'Test' },
    };
    const error: CreateTagError = new CreateTagError(
      new Error('Any Error'),
    );
    const response: CreateTagResponse = {
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
    const controller = makeCreateTagController();
    const request: HttpRequest = {
      body: { name: 'Test', tag: { name: 'test' } },
    };

    const createTagResponse: TagResponse = {
      id: faker.datatype.number(),
      name: 'test',
    };

    const response: CreateTagResponse = {
      isLeft: jest.fn().mockReturnValue(false),
      isRight: jest.fn().mockReturnValue(true),
      value: createTagResponse,
    };

    useCaseMock.execute.mockResolvedValue(response);

    const httpResult = await controller.handle(request);

    expect(httpResult).not.toBeNull();
    expect(httpResult.statusCode).toEqual(201);
    expect(httpResult.body).toEqual(createTagResponse);
  });

  test('Should response 500 if UseCase throw error when handle controller', async () => {
    const controller = makeCreateTagController();
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
