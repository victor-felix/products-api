import Joi from '@hapi/joi';
import HapiEntityValidator from "@external/validations/helpers/hapi-request-validator";
import RequestValidator from "@usecases/port/request-validator";
import ResultValidator from "@usecases/port/result-validator";
import GetTagByQueryRequest from '@usecases/tag/v1/domain/get-tag-by-query-request';

class GetTagByQueryRequestValidator
extends HapiEntityValidator<GetTagByQueryRequest>
implements RequestValidator<GetTagByQueryRequest> {
  constructor() {
    const requestSchema = Joi.object<GetTagByQueryRequest>({
      id: Joi.number().optional(),
      name: Joi.string().optional(),
      skip: Joi.number().optional(),
      take: Joi.number().optional(),
    });

    super(requestSchema);
  }

  public validate(request: GetTagByQueryRequest): ResultValidator<GetTagByQueryRequest> {
    return super.validate(request);
  }
}

export default GetTagByQueryRequestValidator
