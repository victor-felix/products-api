import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import TagRepository from './port/tag-repository';
import CreateTagRequest from './domain/create-tag-request';
import RequestValidator from '@usecases/port/request-validator';
import CreateTagUseCase from './create-tag-use-case';
import ResultValidator from '@usecases/port/result-validator';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import CreateTagError from '@usecases/errors/create-tag-error';
import Tag from '@entities/tag';
import TagAlreadyExistsError from '@usecases/errors/tag-already-exists-error';

const tagRepositoryMock: MockProxy<TagRepository> & TagRepository = mock<TagRepository>();

const requestValidatorMock:
  MockProxy<RequestValidator<CreateTagRequest>>
  & RequestValidator<CreateTagRequest> = mock<RequestValidator<CreateTagRequest>>();

const makeCreateTagUseCase = () => new CreateTagUseCase(
  requestValidatorMock,
  tagRepositoryMock,
);

describe('V1 Create Tag Use Case', () => {
  beforeEach(() => {
    mockReset(tagRepositoryMock);
    mockReset(tagRepositoryMock);
    mockReset(requestValidatorMock);
  })

  test('Should throw if invalid request when empty data', async () => {
    const useCase = makeCreateTagUseCase();
    const request: CreateTagRequest = {
      name: '',
    };
    const resultValidator: ResultValidator<CreateTagRequest> = {
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

  test('Should throw if tag already exists', async () => {
    const useCase = makeCreateTagUseCase();
    const request: CreateTagRequest = {
      name: 'test',
    };
    const resultValidator: ResultValidator<CreateTagRequest> = {
      isValid: true,
      fields: { ...request },
    };

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    tagRepositoryMock.findByName.mockResolvedValue({
      id: faker.datatype.number(),
      name: faker.datatype.string(),
    });

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(
      new TagAlreadyExistsError(),
    );
  });

  test('Should throw error when use case fail', async () => {
    const useCase = makeCreateTagUseCase();
    const request: CreateTagRequest = {
      name: faker.datatype.string(),
    };
    const resultValidator: ResultValidator<CreateTagRequest> = {
      isValid: true,
      value: request,
    };
    const error = new Error('Any Error.');

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    tagRepositoryMock.findByName.mockRejectedValue(error);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(new CreateTagError(error));
  });

  test('Should return response when tag not exists and use case success', async () => {
    const useCase = makeCreateTagUseCase();
    const request: CreateTagRequest = {
      name: faker.datatype.string(),
    };
    const resultValidator: ResultValidator<CreateTagRequest> = {
      isValid: true,
      value: request,
    };
    const createdTag: Tag = {
      id: faker.datatype.number(),
      name: request.name,
    };


    requestValidatorMock.validate.mockReturnValue(resultValidator);
    tagRepositoryMock.findByName.mockResolvedValue(undefined);
    tagRepositoryMock.save.mockResolvedValue(createdTag);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(false);
    expect(response.isRight()).toBe(true);
    expect(response.value).toEqual(createdTag);
  });
});
