import Joi from '@hapi/joi';
import HapiEntityValidator from "@external/validations/helpers/hapi-request-validator";
import RequestValidator from "@usecases/port/request-validator";
import ResultValidator from "@usecases/port/result-validator";
import DeleteProductRequest from '@usecases/product/v1/domain/delete-product-request';

class DeleteProductRequestValidator
extends HapiEntityValidator<DeleteProductRequest>
implements RequestValidator<DeleteProductRequest> {
  constructor() {

    const requestSchema = Joi.object<DeleteProductRequest>({
      id: Joi.number().min(1).required(),
    });

    super(requestSchema);
  }

  public validate(request: DeleteProductRequest): ResultValidator<DeleteProductRequest> {
    return super.validate(request);
  }
}

export default DeleteProductRequestValidator
