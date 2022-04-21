import GetTagByPathError from "@usecases/errors/get-tag-by-path-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import TagNotFoundError from "@usecases/errors/tag-not-found-error";
import { left, right } from "@usecases/helpers/either";
import RequestValidator from "@usecases/port/request-validator";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import { inject, injectable } from "tsyringe";
import GetTagByPathRequest from "./domain/get-tag-by-path-request";
import { GetTagByPathResponse } from "./domain/get-tag-by-path-response";
import TagRepository from "./port/tag-repository";

@injectable()
class GetTagByPathUseCase
  implements
    UseCase<
      RequestAndResponse<
        GetTagByPathRequest,
        GetTagByPathResponse
      >
    >
{
  private readonly requestValidator: RequestValidator<GetTagByPathRequest>;

  private readonly tagRepository: TagRepository;

  constructor(
    @inject('GetTagByPathRequestValidator') requestValidator: RequestValidator<GetTagByPathRequest>,
    @inject('TagRepository') tagRepository: TagRepository,
  ) {
    this.requestValidator = requestValidator;
    this.tagRepository = tagRepository;
  }

  async execute(request: GetTagByPathRequest): Promise<GetTagByPathResponse> {
    try {
      const resultValidator = this.requestValidator.validate(request);

      if (!resultValidator.isValid) {
        return left(new InvalidDataError(resultValidator.fields));
      }

      const tagExists = await this.tagRepository.findById(request.id);

      if (!tagExists) {
        return left(new TagNotFoundError());
      }

      return right(tagExists);
    } catch (error) {
      return left(new GetTagByPathError(error))
    }
  }
}

export default GetTagByPathUseCase;
