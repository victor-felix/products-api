import GetProductByQueryError from "@usecases/errors/get-product-by-query-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import { left, right } from "@usecases/helpers/either";
import RequestValidator from "@usecases/port/request-validator";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import { inject, injectable } from "tsyringe";
import GetProductByQueryRequest from "./domain/get-product-by-query-request";
import { GetProductByQueryResponse } from "./domain/get-product-by-query-response";
import ProductRepository from "./port/product-repository";

@injectable()
class GetProductByQueryUseCase
  implements
    UseCase<
      RequestAndResponse<
        GetProductByQueryRequest,
        GetProductByQueryResponse
      >
    >
{
  private readonly requestValidator: RequestValidator<GetProductByQueryRequest>;

  private readonly productRepository: ProductRepository;

  constructor(
    @inject('GetProductByQueryRequestValidator') requestValidator: RequestValidator<GetProductByQueryRequest>,
    @inject('ProductRepository') productRepository: ProductRepository,
  ) {
    this.requestValidator = requestValidator;
    this.productRepository = productRepository;
  }

  async execute(request: GetProductByQueryRequest): Promise<GetProductByQueryResponse> {
    try {
      const resultValidator = this.requestValidator.validate(request);

      if (!resultValidator.isValid) {
        return left(new InvalidDataError(resultValidator.fields));
      }

      const products = await this.productRepository.query(request);

      return right(products);
    } catch (error) {
      return left(new GetProductByQueryError(error))
    }
  }
}

export default GetProductByQueryUseCase;
