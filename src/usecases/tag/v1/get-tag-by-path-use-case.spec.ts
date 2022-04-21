import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import TagRepository from './port/tag-repository';
import RequestValidator from '@usecases/port/request-validator';
import ResultValidator from '@usecases/port/result-validator';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import GetTagByPathUseCase from './get-tag-by-path-use-case';
import GetTagByPathRequest from './domain/get-tag-by-path-request';
import GetTagByPathError from '@usecases/errors/get-tag-by-path-error';
import TagNotFoundError from '@usecases/errors/tag-not-found-error';

const tagRepositoryMock: MockProxy<TagRepository> & TagRepository = mock<TagRepository>();

const requestValidatorMock:
  MockProxy<RequestValidator<GetTagByPathRequest>>
  & RequestValidator<GetTagByPathRequest> = mock<RequestValidator<GetTagByPathRequest>>();

const makeGetTagByPathUseCase = () => new GetTagByPathUseCase(
  requestValidatorMock,
  tagRepositoryMock,
);

describe('V1 Get Tag By Path Use Case', () => {
  beforeEach(() => {
    mockReset(tagRepositoryMock);
    mockReset(requestValidatorMock);
  });

  test('Should throw if invalid request when the id parameter is null', async () => {
    const useCase = makeGetTagByPathUseCase();
    const request: GetTagByPathRequest = {
      id: null,
    };
    const resultValidator: ResultValidator<GetTagByPathRequest> = {
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

  test('Should throw if tag not found', async () => {
    const useCase = makeGetTagByPathUseCase();
    const request: GetTagByPathRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<GetTagByPathRequest> = {
      isValid: true,
      fields: { ...request },
    };

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    tagRepositoryMock.findById.mockResolvedValue(undefined);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(
      new TagNotFoundError(),
    );
  });

  test('Should throw error when use case fail', async () => {
    const useCase = makeGetTagByPathUseCase();
    const request: GetTagByPathRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<GetTagByPathRequest> = {
      isValid: true,
      value: request,
    };
    const error = new Error('Any Error.');

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    tagRepositoryMock.findById.mockRejectedValue(error);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(new GetTagByPathError(error));
  });

  test('Should return response when use case success', async () => {
    const useCase = makeGetTagByPathUseCase();
    const request: GetTagByPathRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<GetTagByPathRequest> = {
      isValid: true,
      value: request,
    };

    const tag = {
      id: request.id,
      name: faker.datatype.string(),
    };

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    tagRepositoryMock.findById.mockResolvedValue(tag);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(false);
    expect(response.isRight()).toBe(true);
    expect(response.value).toEqual(tag);
  });
});
