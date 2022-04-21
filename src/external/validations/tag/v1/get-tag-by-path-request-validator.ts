import Joi from '@hapi/joi';
import HapiEntityValidator from "@external/validations/helpers/hapi-request-validator";
import RequestValidator from "@usecases/port/request-validator";
import ResultValidator from "@usecases/port/result-validator";
import GetTagByPathRequest from '@usecases/tag/v1/domain/get-tag-by-path-request';

class GetTagByPathRequestValidator
extends HapiEntityValidator<GetTagByPathRequest>
implements RequestValidator<GetTagByPathRequest> {
  constructor() {

    const requestSchema = Joi.object<GetTagByPathRequest>({
      id: Joi.number().min(1).required(),
    });

    super(requestSchema);
  }

  public validate(request: GetTagByPathRequest): ResultValidator<GetTagByPathRequest> {
    return super.validate(request);
  }
}

export default GetTagByPathRequestValidator
