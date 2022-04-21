import DeleteTagError from "@usecases/errors/delete-tag-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import TagNotFoundError from "@usecases/errors/tag-not-found-error";
import { left, right } from "@usecases/helpers/either";
import RequestValidator from "@usecases/port/request-validator";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import { inject, injectable } from "tsyringe";
import ExportJsonTagProductsByPathRequest from "./domain/export-json-tag-products-by-path-request";
import ExportJsonTagProductsByPathResponse from "./domain/export-json-tag-products-by-path-response";
import TagRepository from "./port/tag-repository";

@injectable()
class ExportJsonTagProductsByPathUseCase implements
  UseCase<RequestAndResponse<ExportJsonTagProductsByPathRequest, ExportJsonTagProductsByPathResponse>> {

  private readonly requestValidator: RequestValidator<ExportJsonTagProductsByPathRequest>;

  private readonly tagRepository: TagRepository;

  constructor(
    @inject('ExportJsonTagProductsByPathValidator') requestValidator:
      RequestValidator<ExportJsonTagProductsByPathRequest>,
    @inject('TagRepository') tagRepository: TagRepository,
  ) {
    this.requestValidator = requestValidator;
    this.tagRepository = tagRepository;
  }

  async execute(request: ExportJsonTagProductsByPathRequest): Promise<ExportJsonTagProductsByPathResponse> {
    try {
      const resultValidator = this.requestValidator.validate(request);

      if (!resultValidator.isValid) {
        return left(new InvalidDataError(resultValidator.fields));
      }

      const tagExists = await this.tagRepository.findByIdWithRelation(request.id);

      if (!tagExists) {
        return left(new TagNotFoundError())
      }

      return right(
        {
          file: JSON.stringify(tagExists.products),
          header: {
            contentType: 'application/json',
            fileName: `tag-${tagExists.name.replace(/\s/g, '-')}-products-${new Date().getTime()}.json`,
          }
        }
      );
    } catch (error) {
      return left(new DeleteTagError(error))
    }
  }
}

export default ExportJsonTagProductsByPathUseCase;
