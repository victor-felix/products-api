import Joi from '@hapi/joi';
import HapiEntityValidator from "@external/validations/helpers/hapi-request-validator";
import RequestValidator from "@usecases/port/request-validator";
import ResultValidator from "@usecases/port/result-validator";
import UpdateTagRequest from '@usecases/tag/v1/domain/update-tag-request';

class UpdateTagRequestValidator
extends HapiEntityValidator<UpdateTagRequest>
implements RequestValidator<UpdateTagRequest> {
  constructor() {
    const requestSchema = Joi.object<UpdateTagRequest>({
      id: Joi.string().required(),
      name: Joi.string().required(),
    });

    super(requestSchema);
  }

  public validate(request: UpdateTagRequest): ResultValidator<UpdateTagRequest> {
    return super.validate(request);
  }
}

export default UpdateTagRequestValidator
