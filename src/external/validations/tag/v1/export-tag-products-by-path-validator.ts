import Joi from '@hapi/joi';
import HapiEntityValidator from "@external/validations/helpers/hapi-request-validator";
import RequestValidator from "@usecases/port/request-validator";
import ResultValidator from "@usecases/port/result-validator";
import ExportJsonTagProductsByPathRequest from '@usecases/tag/v1/domain/export-json-tag-products-by-path-request';

class ExportJsonTagProductsByPathValidator
extends HapiEntityValidator<ExportJsonTagProductsByPathRequest>
implements RequestValidator<ExportJsonTagProductsByPathRequest> {
  constructor() {

    const requestSchema = Joi.object<ExportJsonTagProductsByPathRequest>({
      id: Joi.number().min(1).required(),
    });

    super(requestSchema);
  }

  public validate(request: ExportJsonTagProductsByPathRequest): ResultValidator<ExportJsonTagProductsByPathRequest> {
    return super.validate(request);
  }
}

export default ExportJsonTagProductsByPathValidator
