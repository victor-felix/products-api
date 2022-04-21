import Joi from '@hapi/joi';
import HapiEntityValidator from "@external/validations/helpers/hapi-request-validator";
import RequestValidator from "@usecases/port/request-validator";
import ResultValidator from "@usecases/port/result-validator";
import DeleteTagRequest from '@usecases/tag/v1/domain/delete-tag-request';

class DeleteTagRequestValidator
extends HapiEntityValidator<DeleteTagRequest>
implements RequestValidator<DeleteTagRequest> {
  constructor() {

    const requestSchema = Joi.object<DeleteTagRequest>({
      id: Joi.number().min(1).required(),
    });

    super(requestSchema);
  }

  public validate(request: DeleteTagRequest): ResultValidator<DeleteTagRequest> {
    return super.validate(request);
  }
}

export default DeleteTagRequestValidator
