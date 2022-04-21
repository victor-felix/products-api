import Joi from '@hapi/joi';
import HapiEntityValidator from "@external/validations/helpers/hapi-request-validator";
import RequestValidator from "@usecases/port/request-validator";
import ResultValidator from "@usecases/port/result-validator";
import CreateTagRequest from "@usecases/tag/v1/domain/create-tag-request";

class CreateTagRequestValidator
extends HapiEntityValidator<CreateTagRequest>
implements RequestValidator<CreateTagRequest> {
  constructor() {
    const requestSchema = Joi.object<CreateTagRequest>({
      name: Joi.string().required(),
    });

    super(requestSchema);
  }

  public validate(request: CreateTagRequest): ResultValidator<CreateTagRequest> {
    return super.validate(request);
  }
}

export default CreateTagRequestValidator
