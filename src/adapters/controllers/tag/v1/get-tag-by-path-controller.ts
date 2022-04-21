import Controller from "@adapters/controllers/port/controller";
import HttpRequest from "@adapters/controllers/port/http-request";
import HttpResponse from "@adapters/controllers/port/http-response";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import TagNotFoundError from "@usecases/errors/tag-not-found-error";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import GetTagByPathRequest from "@usecases/tag/v1/domain/get-tag-by-path-request";
import { GetTagByPathResponse } from "@usecases/tag/v1/domain/get-tag-by-path-response";
import { inject, injectable } from "tsyringe";

@injectable()
class GetTagByPathController extends Controller {
  private readonly useCase: UseCase<RequestAndResponse<GetTagByPathRequest, GetTagByPathResponse>>;

  constructor(
    @inject('GetTagByPathUseCase') useCase:
      UseCase<RequestAndResponse<GetTagByPathRequest, GetTagByPathResponse>>
  ) {
    super();
    this.useCase = useCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const request: GetTagByPathRequest = {
        ...httpRequest.params,
      };
      const response = await this.useCase.execute(request);

      if (response.isLeft()) {
        if (response.value instanceof InvalidDataError) {
          return this.unprocessableEntity(response.value as InvalidDataError);
        }

        if (response.value instanceof TagNotFoundError) {
          return this.notFound(response.value as InvalidDataError);
        }
      }

      return this.ok({ body: response.value });
    } catch (error) {
      return this.serverError('Internal error');
    }
  }
}

export default GetTagByPathController;
