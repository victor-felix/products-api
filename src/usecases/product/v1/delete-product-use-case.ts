import DeleteProductError from "@usecases/errors/delete-product-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import ProductNotFoundError from "@usecases/errors/product-not-found-error";
import { left, right } from "@usecases/helpers/either";
import RequestValidator from "@usecases/port/request-validator";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import { inject, injectable } from "tsyringe";
import DeleteProductRequest from "./domain/delete-product-request";
import { DeleteProductResponse } from "./domain/delete-product-response";
import ProductRepository from "./port/product-repository";

@injectable()
class DeleteProductUseCase implements UseCase<RequestAndResponse<DeleteProductRequest, DeleteProductResponse>> {
  private readonly requestValidator: RequestValidator<DeleteProductRequest>;

  private readonly productRepository: ProductRepository;

  constructor(
    @inject('DeleteProductRequestValidator') requestValidator: RequestValidator<DeleteProductRequest>,
    @inject('ProductRepository') productRepository: ProductRepository,
  ) {
    this.requestValidator = requestValidator;
    this.productRepository = productRepository;
  }

  async execute(request: DeleteProductRequest): Promise<DeleteProductResponse> {
    try {
      const resultValidator = this.requestValidator.validate(request);

      if (!resultValidator.isValid) {
        return left(new InvalidDataError(resultValidator.fields));
      }

      const productExists = await this.productRepository.findById(request.id);

      if (!productExists) {
        return left(new ProductNotFoundError())
      }

      await this.productRepository.delete(request.id);

      return right(null);
    } catch (error) {
      return left(new DeleteProductError(error))
    }
  }
}

export default DeleteProductUseCase;
