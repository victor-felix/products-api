import Tag from "@entities/tag";
import GetTagByQueryError from "@usecases/errors/get-tag-by-query-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import { left, right } from "@usecases/helpers/either";
import RequestValidator from "@usecases/port/request-validator";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import { inject, injectable } from "tsyringe";
import GetTagByQueryRequest from "./domain/get-tag-by-query-request";
import { GetTagByQueryResponse } from "./domain/get-tag-by-query-response";
import TagRepository from "./port/tag-repository";

@injectable()
class GetTagByQueryUseCase
  implements
    UseCase<
      RequestAndResponse<
        GetTagByQueryRequest,
        GetTagByQueryResponse
      >
    >
{
  private readonly requestValidator: RequestValidator<GetTagByQueryRequest>;

  private readonly tagRepository: TagRepository;

  constructor(
    @inject('GetTagByQueryRequestValidator') requestValidator: RequestValidator<GetTagByQueryRequest>,
    @inject('TagRepository') tagRepository: TagRepository,
  ) {
    this.requestValidator = requestValidator;
    this.tagRepository = tagRepository;
  }

  async execute(request: GetTagByQueryRequest): Promise<GetTagByQueryResponse> {
    try {
      const resultValidator = this.requestValidator.validate(request);

      if (!resultValidator.isValid) {
        return left(new InvalidDataError(resultValidator.fields));
      }

      const tagQuery = {
        ...request
      } as Tag;

      const tags = await this.tagRepository.query(tagQuery);

      return right(tags);
    } catch (error) {
      return left(new GetTagByQueryError(error))
    }
  }
}

export default GetTagByQueryUseCase;
