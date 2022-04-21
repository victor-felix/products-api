import Joi from '@hapi/joi';
import HapiEntityValidator from "@external/validations/helpers/hapi-request-validator";
import RequestValidator from "@usecases/port/request-validator";
import ResultValidator from "@usecases/port/result-validator";
import GetProductByPathRequest from '@usecases/product/v1/domain/get-product-by-path-request';

class GetProductByPathRequestValidator
extends HapiEntityValidator<GetProductByPathRequest>
implements RequestValidator<GetProductByPathRequest> {
  constructor() {

    const requestSchema = Joi.object<GetProductByPathRequest>({
      id: Joi.number().min(1).required(),
    });

    super(requestSchema);
  }

  public validate(request: GetProductByPathRequest): ResultValidator<GetProductByPathRequest> {
    return super.validate(request);
  }
}

export default GetProductByPathRequestValidator
