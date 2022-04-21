import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import TagRepository from './port/tag-repository';
import RequestValidator from '@usecases/port/request-validator';
import ResultValidator from '@usecases/port/result-validator';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import GetTagByQueryUseCase from './get-tag-by-query-use-case';
import GetTagByQueryRequest from './domain/get-tag-by-query-request';
import GetTagByQueryError from '@usecases/errors/get-tag-by-query-error';

const tagRepositoryMock: MockProxy<TagRepository> & TagRepository = mock<TagRepository>();

const requestValidatorMock:
  MockProxy<RequestValidator<GetTagByQueryRequest>>
  & RequestValidator<GetTagByQueryRequest> = mock<RequestValidator<GetTagByQueryRequest>>();

const makeGetTagByQueryUseCase = () => new GetTagByQueryUseCase(
  requestValidatorMock,
  tagRepositoryMock,
);

describe('V1 Get Tag By Query Use Case', () => {
  beforeEach(() => {
    mockReset(tagRepositoryMock);
    mockReset(requestValidatorMock);
  });

  test('Should throw if invalid request when the id parameter is null', async () => {
    const useCase = makeGetTagByQueryUseCase();
    const request: GetTagByQueryRequest = {
      id: null,
    };
    const resultValidator: ResultValidator<GetTagByQueryRequest> = {
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
    const useCase = makeGetTagByQueryUseCase();
    const request: GetTagByQueryRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<GetTagByQueryRequest> = {
      isValid: true,
      value: request,
    };
    const error = new Error('Any Error.');

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    tagRepositoryMock.query.mockRejectedValue(error);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(new GetTagByQueryError(error));
  });

  test('Should return response when use case success', async () => {
    const useCase = makeGetTagByQueryUseCase();
    const request: GetTagByQueryRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<GetTagByQueryRequest> = {
      isValid: true,
      value: request,
    };
    const tag = {
      id: request.id,
      name: faker.datatype.string(),
    };

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    tagRepositoryMock.query.mockResolvedValue([tag]);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(false);
    expect(response.isRight()).toBe(true);
    expect(response.value).toEqual([tag]);
  });
});
