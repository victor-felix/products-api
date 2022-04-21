import DeleteTagError from "@usecases/errors/delete-tag-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import RelationshipError from "@usecases/errors/relationship-error";
import TagNotFoundError from "@usecases/errors/tag-not-found-error";
import { left, right } from "@usecases/helpers/either";
import RequestValidator from "@usecases/port/request-validator";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import { inject, injectable } from "tsyringe";
import DeleteTagRequest from "./domain/delete-tag-request";
import { DeleteTagResponse } from "./domain/delete-tag-response";
import TagRepository from "./port/tag-repository";

@injectable()
class DeleteTagUseCase implements UseCase<RequestAndResponse<DeleteTagRequest, DeleteTagResponse>> {
  private readonly requestValidator: RequestValidator<DeleteTagRequest>;

  private readonly tagRepository: TagRepository;

  constructor(
    @inject('DeleteTagRequestValidator') requestValidator: RequestValidator<DeleteTagRequest>,
    @inject('TagRepository') tagRepository: TagRepository,
  ) {
    this.requestValidator = requestValidator;
    this.tagRepository = tagRepository;
  }

  async execute(request: DeleteTagRequest): Promise<DeleteTagResponse> {
    try {
      const resultValidator = this.requestValidator.validate(request);

      if (!resultValidator.isValid) {
        return left(new InvalidDataError(resultValidator.fields));
      }

      const tagExists = await this.tagRepository.findByIdWithRelation(request.id);

      if (!tagExists) {
        return left(new TagNotFoundError())
      }

      if (tagExists.products.length) {
        return left(new RelationshipError())
      }

      await this.tagRepository.delete(request.id);

      return right(null);
    } catch (error) {
      return left(new DeleteTagError(error))
    }
  }
}

export default DeleteTagUseCase;
