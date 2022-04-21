import GetProductByPathError from "@usecases/errors/get-product-by-path-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import ProductNotFoundError from "@usecases/errors/product-not-found-error";
import { left, right } from "@usecases/helpers/either";
import RequestValidator from "@usecases/port/request-validator";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import { inject, injectable } from "tsyringe";
import GetProductByPathRequest from "./domain/get-product-by-path-request";
import { GetProductByPathResponse } from "./domain/get-product-by-path-response";
import ProductRepository from "./port/product-repository";

@injectable()
class GetProductByPathUseCase
  implements
    UseCase<
      RequestAndResponse<
        GetProductByPathRequest,
        GetProductByPathResponse
      >
    >
{
  private readonly requestValidator: RequestValidator<GetProductByPathRequest>;

  private readonly productRepository: ProductRepository;

  constructor(
    @inject('GetProductByPathRequestValidator') requestValidator: RequestValidator<GetProductByPathRequest>,
    @inject('ProductRepository') productRepository: ProductRepository,
  ) {
    this.requestValidator = requestValidator;
    this.productRepository = productRepository;
  }

  async execute(request: GetProductByPathRequest): Promise<GetProductByPathResponse> {
    try {
      const resultValidator = this.requestValidator.validate(request);

      if (!resultValidator.isValid) {
        return left(new InvalidDataError(resultValidator.fields));
      }

      const productExists = await this.productRepository.findById(request.id);

      if (!productExists) {
        return left(new ProductNotFoundError())
      }

      return right(productExists);
    } catch (error) {
      return left(new GetProductByPathError(error))
    }
  }
}

export default GetProductByPathUseCase;
