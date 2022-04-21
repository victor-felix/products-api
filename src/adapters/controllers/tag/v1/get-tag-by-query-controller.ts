import Controller from "@adapters/controllers/port/controller";
import HttpRequest from "@adapters/controllers/port/http-request";
import HttpResponse from "@adapters/controllers/port/http-response";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import GetTagByQueryRequest from "@usecases/tag/v1/domain/get-tag-by-query-request";
import { GetTagByQueryResponse } from "@usecases/tag/v1/domain/get-tag-by-query-response";
import { inject, injectable } from "tsyringe";

@injectable()
class GetTagByQueryController extends Controller {
  private readonly useCase: UseCase<RequestAndResponse<GetTagByQueryRequest, GetTagByQueryResponse>>;

  constructor(
    @inject('GetTagByQueryUseCase') useCase:
      UseCase<RequestAndResponse<GetTagByQueryRequest, GetTagByQueryResponse>>
  ) {
    super();
    this.useCase = useCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const request: GetTagByQueryRequest = {
        ...httpRequest.query,
      };

      const response = await this.useCase.execute(
        {
          ...request,
          skip: request.skip || 1,
          take: request.take || 10
        }
      );

      if (response.isLeft() && response.value instanceof InvalidDataError) {
        return this.unprocessableEntity(response.value as InvalidDataError);
      }

      return this.ok({ body: response.value });
    } catch (error) {
      return this.serverError('Internal error');
    }
  }
}

export default GetTagByQueryController;
