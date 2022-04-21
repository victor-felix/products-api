import Controller from "@adapters/controllers/port/controller";
import HttpRequest from "@adapters/controllers/port/http-request";
import HttpResponse from "@adapters/controllers/port/http-response";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import ProductNotFoundError from "@usecases/errors/product-not-found-error";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import UpdateProductRequest from "@usecases/product/v1/domain/update-product-request";
import { UpdateProductResponse } from "@usecases/product/v1/domain/update-product-response";
import { inject, injectable } from "tsyringe";

@injectable()
class UpdateProductController extends Controller {
  private readonly useCase: UseCase<RequestAndResponse<UpdateProductRequest, UpdateProductResponse>>;

  constructor(
    @inject('UpdateProductUseCase') useCase: UseCase<RequestAndResponse<UpdateProductRequest, UpdateProductResponse>>
  ) {
    super();
    this.useCase = useCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {

      const request: UpdateProductRequest = {
        id: httpRequest.params.id,
        ...httpRequest.body,
      };

      const response = await this.useCase.execute(request);

      if (response.isLeft() && response.value instanceof InvalidDataError) {
        return this.unprocessableEntity(response.value as InvalidDataError);
      }

      if (response.isLeft() && response.value instanceof ProductNotFoundError) {
        return this.badRequest(response.value as ProductNotFoundError);
      }

      return this.ok({ body: response.value });
    } catch (error) {
      return this.serverError('Internal error');
    }
  }
}

export default UpdateProductController;
