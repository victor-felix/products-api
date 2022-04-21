import Controller from "@adapters/controllers/port/controller";
import HttpRequest from "@adapters/controllers/port/http-request";
import HttpResponse from "@adapters/controllers/port/http-response";
import CreateTagError from "@usecases/errors/create-tag-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import CreateTagRequest from "@usecases/tag/v1/domain/create-tag-request";
import { CreateTagResponse } from "@usecases/tag/v1/domain/create-tag-response";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateTagController extends Controller {
  private readonly useCase: UseCase<RequestAndResponse<CreateTagRequest, CreateTagResponse>>;

  constructor(
    @inject('CreateTagUseCase') useCase: UseCase<RequestAndResponse<CreateTagRequest, CreateTagResponse>>
  ) {
    super();
    this.useCase = useCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const request: CreateTagRequest = {
        ...httpRequest.body,
      };

      const response = await this.useCase.execute(request);

      if (response.isLeft() && response.value instanceof InvalidDataError) {
        return this.unprocessableEntity(response.value as InvalidDataError);
      }

      if (response.isLeft() && response.value instanceof CreateTagError) {
        return this.badRequest(response.value as CreateTagError);
      }

      return this.okCreated({ body: response.value });
    } catch (error) {
      return this.serverError('Internal error');
    }
  }
}

export default CreateTagController;
