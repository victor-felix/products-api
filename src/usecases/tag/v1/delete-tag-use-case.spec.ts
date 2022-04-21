import 'reflect-metadata';
import faker from 'faker';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import TagRepository from './port/tag-repository';
import RequestValidator from '@usecases/port/request-validator';
import ResultValidator from '@usecases/port/result-validator';
import InvalidDataError from '@usecases/errors/invalid-data-error';
import DeleteTagUseCase from './delete-tag-use-case';
import DeleteTagRequest from './domain/delete-tag-request';
import TagNotFoundError from '@usecases/errors/tag-not-found-error';
import DeleteTagError from '@usecases/errors/delete-tag-error';
import RelationshipError from '@usecases/errors/relationship-error';

const tagRepositoryMock: MockProxy<TagRepository> & TagRepository = mock<TagRepository>();

const requestValidatorMock:
  MockProxy<RequestValidator<DeleteTagRequest>>
  & RequestValidator<DeleteTagRequest> = mock<RequestValidator<DeleteTagRequest>>();

const makeDeleteTagUseCase = () => new DeleteTagUseCase(
  requestValidatorMock,
  tagRepositoryMock,
);

describe('V1 Delete Tag Use Case', () => {
  beforeEach(() => {
    mockReset(tagRepositoryMock);
    mockReset(requestValidatorMock);
  });

  test('Should throw if invalid request when the id parameter is null', async () => {
    const useCase = makeDeleteTagUseCase();
    const request: DeleteTagRequest = {
      id: null,
    };
    const resultValidator: ResultValidator<DeleteTagRequest> = {
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
    const useCase = makeDeleteTagUseCase();
    const request: DeleteTagRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<DeleteTagRequest> = {
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

  test('Should throw if tag has products', async () => {
    const useCase = makeDeleteTagUseCase();
    const request: DeleteTagRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<DeleteTagRequest> = {
      isValid: true,
      value: request,
    };

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    tagRepositoryMock.findByIdWithRelation.mockResolvedValue({
      id: request.id,
      name: faker.datatype.string(),
      products: [
        {
          id: faker.datatype.number(),
          name: faker.datatype.string(),
        }
      ],
    });

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(new RelationshipError());
  });

  test('Should throw error when use case fail', async () => {
    const useCase = makeDeleteTagUseCase();
    const request: DeleteTagRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<DeleteTagRequest> = {
      isValid: true,
      value: request,
    };
    const error = new Error('Any Error.');

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    tagRepositoryMock.findByIdWithRelation.mockRejectedValue(error);

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(true);
    expect(response.isRight()).toBe(false);
    expect(response.value).toEqual(new DeleteTagError(error));
  });

  test('Should return response when use case success', async () => {
    const useCase = makeDeleteTagUseCase();
    const request: DeleteTagRequest = {
      id: faker.datatype.number(),
    };
    const resultValidator: ResultValidator<DeleteTagRequest> = {
      isValid: true,
      value: request,
    };

    requestValidatorMock.validate.mockReturnValue(resultValidator);
    tagRepositoryMock.findByIdWithRelation.mockResolvedValue({
      id: request.id,
      name: faker.datatype.string(),
      products: [],
    });
    tagRepositoryMock.delete.mockResolvedValue();

    const response = await useCase.execute(request);

    expect(response.isLeft()).toBe(false);
    expect(response.isRight()).toBe(true);
    expect(response.value).toEqual(null);
  });
});
