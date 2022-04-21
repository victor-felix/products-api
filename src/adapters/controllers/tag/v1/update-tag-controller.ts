import Controller from "@adapters/controllers/port/controller";
import HttpRequest from "@adapters/controllers/port/http-request";
import HttpResponse from "@adapters/controllers/port/http-response";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import TagNotFoundError from "@usecases/errors/tag-not-found-error";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import UpdateTagRequest from "@usecases/tag/v1/domain/update-tag-request";
import { UpdateTagResponse } from "@usecases/tag/v1/domain/update-tag-response";
import { inject, injectable } from "tsyringe";

@injectable()
class UpdateTagController extends Controller {
  private readonly useCase: UseCase<RequestAndResponse<UpdateTagRequest, UpdateTagResponse>>;

  constructor(
    @inject('UpdateTagUseCase') useCase: UseCase<RequestAndResponse<UpdateTagRequest, UpdateTagResponse>>
  ) {
    super();
    this.useCase = useCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {

      const request: UpdateTagRequest = {
        id: httpRequest.params.id,
        ...httpRequest.body,
      };

      const response = await this.useCase.execute(request);

      if (response.isLeft() && response.value instanceof InvalidDataError) {
        return this.unprocessableEntity(response.value as InvalidDataError);
      }

      if (response.isLeft() && response.value instanceof TagNotFoundError) {
        return this.badRequest(response.value as TagNotFoundError);
      }

      return this.ok({ body: response.value });
    } catch (error) {
      return this.serverError('Internal error');
    }
  }
}

export default UpdateTagController;
