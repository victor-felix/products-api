import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import TagRepository from './port/tag-repository';
import RequestValidator from '@usecases/port/request-validator';
import ResultValidator from '@usecases/port/result-validator';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import UpdateTagRequest from './domain/update-tag-request';
import UpdateTagUseCase from './update-tag-use-case';
import Tag from '@entities/tag';
import TagNotFoundError from '@usecases/errors/tag-not-found-error';
import UpdateTagError from '@usecases/errors/update-tag-error';

const tagRepositoryMock: MockProxy<TagRepository> & TagRepository = mock<TagRepository>();

const requestValidatorMock:
  MockProxy<RequestValidator<UpdateTagRequest>>
  & RequestValidator<UpdateTagRequest> = mock<RequestValidator<UpdateTagRequest>>();

const makeUpdateTagUseCase = () => new UpdateTagUseCase(
  requestValidatorMock,
  tagRepositoryMock,
);

describe('V1 Update Tag Use Case', () => {
  beforeEach(() => {
    mockReset(tagRepositoryMock);
    mockReset(requestValidatorMock);
  });

  test('Should throw if invalid request when the id parameter is null', async () => {
    const useCase = makeUpdateTagUseCase();
    const request: UpdateTagRequest = {
      id: null,
      name: faker.datatype.string(),
    };
    const resultValidator: ResultValidator<UpdateTagRequest> = {
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
    const useCase = makeUpdateTagUseCase();
    const request: UpdateTagRequest = {
      id: faker.datatype.number(),
      name: faker.datatype.string(),
    };
    const resultValidator: ResultValidator<UpdateTagRequest> = {
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
    const useCase = makeUpdateTagUseCase();
    const request: UpdateTagRequest = {
      id: faker.datatype.number(),
      name: faker.datatype.string(),
    };
    const resultValidator: ResultValidator<UpdateTagRequest> = {
      isValid: true,
      value: request,
    };
    const error = new Error('Any Error.');

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    tagRepositoryMock.findById.mockRejectedValue(error);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(new UpdateTagError(error));
  });

  test('Should return response when tag not exists and use case success', async () => {
    const useCase = makeUpdateTagUseCase();
    const request: UpdateTagRequest = {
      id: faker.datatype.number(),
      name: faker.datatype.string(),
    };
    const resultValidator: ResultValidator<UpdateTagRequest> = {
      isValid: true,
      value: request,
    };
    const createdTag: Tag = {
      id: request.id,
      name: faker.datatype.string(),
    };
    const updatedTag: Tag = {
      id: request.id,
      name: request.name,
    };

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    tagRepositoryMock.findById.mockResolvedValue({
      id: faker.datatype.number(),
      name: faker.datatype.string(),
    });
    tagRepositoryMock.findByName.mockResolvedValue(undefined);
    tagRepositoryMock.save.mockResolvedValue(createdTag);
    tagRepositoryMock.save.mockResolvedValue(updatedTag);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(false);
    expect(response.isRight()).toBe(true);
    expect(response.value).toEqual(updatedTag);
  });
});
