import Controller from "@adapters/controllers/port/controller";
import HttpRequest from "@adapters/controllers/port/http-request";
import HttpResponse from "@adapters/controllers/port/http-response";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import DeleteProductRequest from "@usecases/product/v1/domain/delete-product-request";
import { DeleteProductResponse } from "@usecases/product/v1/domain/delete-product-response";
import { inject, injectable } from "tsyringe";

@injectable()
class DeleteProductByPathController extends Controller {
  private readonly useCase: UseCase<RequestAndResponse<DeleteProductRequest, DeleteProductResponse>>;

  constructor(
    @inject('DeleteProductUseCase') useCase: UseCase<RequestAndResponse<DeleteProductRequest, DeleteProductResponse>>
  ) {
    super();
    this.useCase = useCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const request: DeleteProductRequest = {
        ...httpRequest.params,
      };

      const response = await this.useCase.execute(request);

      if (response.isLeft() && response.value instanceof InvalidDataError) {
        return this.unprocessableEntity(response.value as InvalidDataError);
      }

      return this.okNoContent({ body: response.value });
    } catch (error) {
      return this.serverError('Internal error');
    }
  }
}

export default DeleteProductByPathController;
