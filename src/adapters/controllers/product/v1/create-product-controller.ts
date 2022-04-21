import Controller from "@adapters/controllers/port/controller";
import HttpRequest from "@adapters/controllers/port/http-request";
import HttpResponse from "@adapters/controllers/port/http-response";
import CreateProductError from "@usecases/errors/create-product-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import CreateProductRequest from "@usecases/product/v1/domain/create-product-request";
import { CreateProductResponse } from "@usecases/product/v1/domain/create-product-response";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateProductController extends Controller {
  private readonly useCase: UseCase<RequestAndResponse<CreateProductRequest, CreateProductResponse>>;

  constructor(
    @inject('CreateProductUseCase') useCase: UseCase<RequestAndResponse<CreateProductRequest, CreateProductResponse>>
  ) {
    super();
    this.useCase = useCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const request: CreateProductRequest = {
        ...httpRequest.body,
      };

      const response = await this.useCase.execute(request);

      if (response.isLeft()) {
        if (response.value instanceof InvalidDataError) {
          return this.unprocessableEntity(response.value as InvalidDataError);
        }

        if (response.value instanceof CreateProductError) {
          return this.badRequest(response.value as CreateProductError);
        }
      }

      return this.okCreated({ body: response.value });
    } catch (error) {
      return this.serverError('Internal error');
    }
  }
}

export default CreateProductController;
