import Joi from '@hapi/joi';
import HapiEntityValidator from "@external/validations/helpers/hapi-request-validator";
import RequestValidator from "@usecases/port/request-validator";
import ResultValidator from "@usecases/port/result-validator";
import CreateProductRequest from "@usecases/product/v1/domain/create-product-request";

class CreateManyProductsValidator
extends HapiEntityValidator<CreateProductRequest>
implements RequestValidator<CreateProductRequest> {
  constructor() {

    const productSchema = Joi.object<CreateProductRequest>({
      name: Joi.string().required(),
    });

    const schema = Joi.object({
      products: Joi.array().items(productSchema).min(1).required(),
    });

    super(schema);
  }

  public validate(request: CreateProductRequest): ResultValidator<CreateProductRequest> {
    return super.validate(request);
  }
}

export default CreateManyProductsValidator
