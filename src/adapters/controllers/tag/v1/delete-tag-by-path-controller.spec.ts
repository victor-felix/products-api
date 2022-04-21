import 'reflect-metadata';
// import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import UseCase, { RequestAndResponse } from '@usecases/port/use-case';
import HttpRequest from '@adapters/controllers/port/http-request';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import DeleteTagByPathController from './delete-tag-by-path-controller';
import DeleteTagRequest from '@usecases/tag/v1/domain/delete-tag-request';
import { DeleteTagResponse } from '@usecases/tag/v1/domain/delete-tag-response';
import RelationshipError from '@usecases/errors/relationship-error';
// import DeleteTagError from '@usecases/errors/delete-tag-error';

const useCaseMock: MockProxy<
  UseCase<
    RequestAndResponse<
      DeleteTagRequest,
      DeleteTagResponse
    >
  >
> &
  UseCase<
    RequestAndResponse<
    DeleteTagRequest,
    DeleteTagResponse
    >
  > =
  mock<
    UseCase<
      RequestAndResponse<
      DeleteTagRequest,
      DeleteTagResponse
      >
    >
  >();

const makeDeleteTagController = () =>
  new DeleteTagByPathController(useCaseMock);

describe('V1 Delete Tag By Path Controller', () => {
  beforeEach(() => {
    mockReset(useCaseMock);
  });

  test('Should response 422 if invalid body when handle controller', async () => {
    const controller = makeDeleteTagController();
    const fields = {
      id: 'id is required',
    };
    const request: HttpRequest = {
      params: {},
    };
    const error: InvalidDataError = new InvalidDataError(fields);
    const response: DeleteTagResponse = {
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

  test('Should response 400 if UseCase fail RelationshipError when handle controller', async () => {
    const controller = makeDeleteTagController();
    const request: HttpRequest = {
      params: { id: 1, },
    };
    const error: RelationshipError = new RelationshipError();
    const response: DeleteTagResponse = {
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

  test('Should response 204 if UseCase success when handle controller', async () => {
    const controller = makeDeleteTagController();
    const request: HttpRequest = {
      params: { id: 1, },
    };

    const response: DeleteTagResponse = {
      isLeft: jest.fn().mockReturnValue(false),
      isRight: jest.fn().mockReturnValue(true),
      value: null
    };

    useCaseMock.execute.mockResolvedValue(response);

    const httpResult = await controller.handle(request);

    expect(httpResult).not.toBeNull();
    expect(httpResult.statusCode).toEqual(204);
    expect(httpResult.body).toEqual(null);
  });

  test('Should response 500 if UseCase throw error when handle controller', async () => {
    const controller = makeDeleteTagController();
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
