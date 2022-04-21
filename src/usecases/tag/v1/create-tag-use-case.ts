import Tag from "@entities/tag";
import CreateTagError from "@usecases/errors/create-tag-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import TagAlreadyExistsError from "@usecases/errors/tag-already-exists-error";
import { left, right } from "@usecases/helpers/either";
import RequestValidator from "@usecases/port/request-validator";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import TagRepository from "@usecases/tag/v1/port/tag-repository";
import { inject, injectable } from "tsyringe";
import CreateTagRequest from "./domain/create-tag-request";
import { CreateTagResponse } from "./domain/create-tag-response";

@injectable()
class CreateTagUseCase implements UseCase<RequestAndResponse<CreateTagRequest, CreateTagResponse>> {
  private readonly requestValidator: RequestValidator<CreateTagRequest>;

  private readonly tagRepository: TagRepository;

  constructor(
    @inject('CreateTagRequestValidator') requestValidator: RequestValidator<CreateTagRequest>,
    @inject('TagRepository') tagRepository: TagRepository,
  ) {
    this.requestValidator = requestValidator;
    this.tagRepository = tagRepository;
    this.tagRepository = tagRepository;
  }

  async execute(request: CreateTagRequest): Promise<CreateTagResponse> {
    try {
      const resultValidator = this.requestValidator.validate(request);

      if (!resultValidator.isValid) {
        return left(new InvalidDataError(resultValidator.fields));
      }

      let tagExists: Tag = await this.tagRepository.findByName(request.name);

      if (tagExists) {
        return left(new TagAlreadyExistsError());
      }

      const createdTag: Tag = await this.tagRepository.save(request);

      return right(createdTag);
    } catch (error) {
      return left(new CreateTagError(error))
    }
  }
}

export default CreateTagUseCase;
