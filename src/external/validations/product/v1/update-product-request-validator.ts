import Joi from '@hapi/joi';
import HapiEntityValidator from "@external/validations/helpers/hapi-request-validator";
import RequestValidator from "@usecases/port/request-validator";
import ResultValidator from "@usecases/port/result-validator";
import Tag from '@entities/tag';
import UpdateProductRequest from '@usecases/product/v1/domain/update-product-request';

class UpdateProductRequestValidator
extends HapiEntityValidator<UpdateProductRequest>
implements RequestValidator<UpdateProductRequest> {
  constructor() {
    const tagSchema = Joi.object<Tag>({
      id: Joi.number().min(1).optional(),
      name: Joi.string().required(),
    });

    const requestSchema = Joi.object<UpdateProductRequest>({
      id: Joi.string().required(),
      name: Joi.string().required(),
      tag: tagSchema.optional(),
    });

    super(requestSchema);
  }

  public validate(request: UpdateProductRequest): ResultValidator<UpdateProductRequest> {
    return super.validate(request);
  }
}

export default UpdateProductRequestValidator
