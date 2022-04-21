import Tag from "@entities/tag";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import ProductNotFoundError from "@usecases/errors/product-not-found-error";
import UpdateProductError from "@usecases/errors/update-product-error";
import { left, right } from "@usecases/helpers/either";
import RequestValidator from "@usecases/port/request-validator";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import TagRepository from "@usecases/tag/v1/port/tag-repository";
import { inject, injectable } from "tsyringe";
import UpdateProductRequest from "./domain/update-product-request";
import { UpdateProductResponse } from "./domain/update-product-response";
import ProductRepository from "./port/product-repository";

@injectable()
class UpdateProductUseCase implements UseCase<RequestAndResponse<UpdateProductRequest, UpdateProductResponse>> {
  private readonly requestValidator: RequestValidator<UpdateProductRequest>;

  private readonly productRepository: ProductRepository;

  private readonly tagRepository: TagRepository;

  constructor(
    @inject('UpdateProductRequestValidator') requestValidator: RequestValidator<UpdateProductRequest>,
    @inject('ProductRepository') productRepository: ProductRepository,
    @inject('TagRepository') tagRepository: TagRepository,
  ) {
    this.requestValidator = requestValidator;
    this.productRepository = productRepository;
    this.tagRepository = tagRepository;
  }

  async execute(request: UpdateProductRequest): Promise<UpdateProductResponse> {
    try {
      const resultValidator = this.requestValidator.validate(request);

      if (!resultValidator.isValid) {
        return left(new InvalidDataError(resultValidator.fields));
      }

      const productExists = await this.productRepository.findById(request.id);

      if (!productExists) {
        return left(new ProductNotFoundError())
      }

      let tagExists: Tag;

      if (request.tag) {
        tagExists = await this.tagRepository.findByName(request.tag.name);

        if (!tagExists) {
          tagExists = await this.tagRepository.save({ name: request.tag.name });
        }

        request.tag = tagExists;
      }

      productExists.name = request.name;

      const updatedProduct = await this.productRepository.save({ ...productExists, tag: tagExists });

      return right(updatedProduct);
    } catch (error) {
      return left(new UpdateProductError(error))
    }
  }
}

export default UpdateProductUseCase;
