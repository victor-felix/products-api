import Product from "@entities/product";
import DeleteTagError from "@usecases/errors/delete-tag-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import TagNotFoundError from "@usecases/errors/tag-not-found-error";
import { left, right } from "@usecases/helpers/either";
import RequestValidator from "@usecases/port/request-validator";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import ProductRepository from "@usecases/product/v1/port/product-repository";
import { inject, injectable } from "tsyringe";
import ImportJsonTagProductsByPathRequest from "./domain/import-json-tag-products-by-path-request";
import ImportJsonTagProductsByPathResponse from "./domain/import-json-tag-products-by-path-response";
import TagRepository from "./port/tag-repository";

@injectable()
class ImportJsonTagProductsByPathUseCase implements
  UseCase<RequestAndResponse<ImportJsonTagProductsByPathRequest, ImportJsonTagProductsByPathResponse>> {

  private readonly requestValidator: RequestValidator<ImportJsonTagProductsByPathRequest>;

  private readonly tagRepository: TagRepository;

  private readonly productRepository: ProductRepository;

  constructor(
    @inject('ImportJsonTagProductsByPathValidator') requestValidator:
      RequestValidator<ImportJsonTagProductsByPathRequest>,
    @inject('TagRepository') tagRepository: TagRepository,
    @inject('ProductRepository') productRepository: ProductRepository,
  ) {
    this.requestValidator = requestValidator;
    this.tagRepository = tagRepository;
    this.productRepository = productRepository;
  }

  async execute(request: ImportJsonTagProductsByPathRequest): Promise<ImportJsonTagProductsByPathResponse> {
    try {
      const resultValidator = this.requestValidator.validate(request);

      if (!resultValidator.isValid) {
        return left(new InvalidDataError(resultValidator.fields));
      }

      const tagExists = await this.tagRepository.findByIdWithRelation(request.id);

      if (!tagExists) {
        return left(new TagNotFoundError())
      }

      const products: Product[] = JSON.parse(request.file.buffer.toString());

      await Promise.all(products.map( async (product: Product) => {
        await this.productRepository.save({ ...product, tag: tagExists })
      }))

      return right(null);
    } catch (error) {
      return left(new DeleteTagError(error))
    }
  }
}

export default ImportJsonTagProductsByPathUseCase;
