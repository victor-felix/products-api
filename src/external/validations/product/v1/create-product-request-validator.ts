import Joi from '@hapi/joi';
import HapiEntityValidator from "@external/validations/helpers/hapi-request-validator";
import RequestValidator from "@usecases/port/request-validator";
import ResultValidator from "@usecases/port/result-validator";
import CreateProductRequest from "@usecases/product/v1/domain/create-product-request";
import Tag from '@entities/tag';

class CreateProductRequestValidator
extends HapiEntityValidator<CreateProductRequest>
implements RequestValidator<CreateProductRequest> {
  constructor() {
    const tagSchema = Joi.object<Tag>({
      id: Joi.number().min(1).optional(),
      name: Joi.string().required(),
    });

    const requestSchema = Joi.object<CreateProductRequest>({
      name: Joi.string().required(),
      tag: tagSchema.required(),
    });

    super(requestSchema);
  }

  public validate(request: CreateProductRequest): ResultValidator<CreateProductRequest> {
    return super.validate(request);
  }
}

export default CreateProductRequestValidator
