import Joi from '@hapi/joi';
import HapiEntityValidator from "@external/validations/helpers/hapi-request-validator";
import RequestValidator from "@usecases/port/request-validator";
import ResultValidator from "@usecases/port/result-validator";
import GetProductByQueryRequest from '@usecases/product/v1/domain/get-product-by-query-request';

class GetProductByQueryRequestValidator
extends HapiEntityValidator<GetProductByQueryRequest>
implements RequestValidator<GetProductByQueryRequest> {
  constructor() {
    const requestSchema = Joi.object<GetProductByQueryRequest>({
      id: Joi.number().optional(),
      name: Joi.string().optional(),
      tag_id: Joi.number().optional(),
      tag_name: Joi.string().optional(),
      skip: Joi.number().optional(),
      take: Joi.number().optional(),
    });

    super(requestSchema);
  }

  public validate(request: GetProductByQueryRequest): ResultValidator<GetProductByQueryRequest> {
    return super.validate(request);
  }
}

export default GetProductByQueryRequestValidator
