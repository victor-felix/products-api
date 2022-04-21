import Controller from "@adapters/controllers/port/controller";
import HttpRequest from "@adapters/controllers/port/http-request";
import HttpResponse from "@adapters/controllers/port/http-response";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import ProductNotFoundError from "@usecases/errors/product-not-found-error";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import GetProductByPathRequest from "@usecases/product/v1/domain/get-product-by-path-request";
import { GetProductByPathResponse } from "@usecases/product/v1/domain/get-product-by-path-response";
import { inject, injectable } from "tsyringe";

@injectable()
class GetProductByPathController extends Controller {
  private readonly useCase: UseCase<RequestAndResponse<GetProductByPathRequest, GetProductByPathResponse>>;

  constructor(
    @inject('GetProductByPathUseCase') useCase:
      UseCase<RequestAndResponse<GetProductByPathRequest, GetProductByPathResponse>>
  ) {
    super();
    this.useCase = useCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const request: GetProductByPathRequest = {
        ...httpRequest.params,
      };
      const response = await this.useCase.execute(request);

      if (response.isLeft()) {
        if (response.value instanceof InvalidDataError) {
          return this.unprocessableEntity(response.value as InvalidDataError);
        }

        if (response.value instanceof ProductNotFoundError) {
          return this.notFound(response.value as ProductNotFoundError);
        }
      }

      return this.ok({ body: response.value });
    } catch (error) {
      return this.serverError('Internal error');
    }
  }
}

export default GetProductByPathController;
