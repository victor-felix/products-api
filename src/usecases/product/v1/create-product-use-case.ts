import Tag from "@entities/tag";
import CreateProductError from "@usecases/errors/create-product-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import { left, right } from "@usecases/helpers/either";
import RequestValidator from "@usecases/port/request-validator";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import TagRepository from "@usecases/tag/v1/port/tag-repository";
import { inject, injectable } from "tsyringe";
import CreateProductRequest from "./domain/create-product-request";
import { CreateProductResponse } from "./domain/create-product-response";
import ProductRepository from "./port/product-repository";

@injectable()
class CreateProductUseCase implements UseCase<RequestAndResponse<CreateProductRequest, CreateProductResponse>> {
  private readonly requestValidator: RequestValidator<CreateProductRequest>;

  private readonly productRepository: ProductRepository;

  private readonly tagRepository: TagRepository;

  constructor(
    @inject('CreateProductRequestValidator') requestValidator: RequestValidator<CreateProductRequest>,
    @inject('ProductRepository') productRepository: ProductRepository,
    @inject('TagRepository') tagRepository: TagRepository,
  ) {
    this.requestValidator = requestValidator;
    this.productRepository = productRepository;
    this.tagRepository = tagRepository;
  }

  async execute(request: CreateProductRequest): Promise<CreateProductResponse> {
    try {
      const resultValidator = this.requestValidator.validate(request);

      if (!resultValidator.isValid) {
        return left(new InvalidDataError(resultValidator.fields));
      }

      let tagExists: Tag = await this.tagRepository.findByName(request.tag.name);

      if (!tagExists) {
        tagExists = await this.tagRepository.save({ name: request.tag.name });
      }

      const product = await this.productRepository.save({ ...request, tag: tagExists });

      return right(product);
    } catch (error) {
      return left(new CreateProductError(error))
    }
  }
}

export default CreateProductUseCase;
