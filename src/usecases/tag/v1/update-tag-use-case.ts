import InvalidDataError from "@usecases/errors/invalid-data-error";
import TagNotFoundError from "@usecases/errors/tag-not-found-error";
import UpdateTagError from "@usecases/errors/update-tag-error";
import { left, right } from "@usecases/helpers/either";
import RequestValidator from "@usecases/port/request-validator";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import TagRepository from "@usecases/tag/v1/port/tag-repository";
import { inject, injectable } from "tsyringe";
import UpdateTagRequest from "./domain/update-tag-request";
import { UpdateTagResponse } from "./domain/update-tag-response";

@injectable()
class UpdateTagUseCase implements UseCase<RequestAndResponse<UpdateTagRequest, UpdateTagResponse>> {
  private readonly requestValidator: RequestValidator<UpdateTagRequest>;

  private readonly tagRepository: TagRepository;

  constructor(
    @inject('UpdateTagRequestValidator') requestValidator: RequestValidator<UpdateTagRequest>,
    @inject('TagRepository') tagRepository: TagRepository,
  ) {
    this.requestValidator = requestValidator;
    this.tagRepository = tagRepository;
    this.tagRepository = tagRepository;
  }

  async execute(request: UpdateTagRequest): Promise<UpdateTagResponse> {
    try {
      const resultValidator = this.requestValidator.validate(request);

      if (!resultValidator.isValid) {
        return left(new InvalidDataError(resultValidator.fields));
      }

      const tagExists = await this.tagRepository.findById(request.id);

      if (!tagExists) {
        return left(new TagNotFoundError())
      }

      tagExists.name = request.name;

      const updatedTag = await this.tagRepository.save(tagExists);

      return right(updatedTag);
    } catch (error) {
      return left(new UpdateTagError(error))
    }
  }
}

export default UpdateTagUseCase;
