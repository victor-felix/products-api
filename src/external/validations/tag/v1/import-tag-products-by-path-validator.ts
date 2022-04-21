import Joi from '@hapi/joi';
import HapiEntityValidator from "@external/validations/helpers/hapi-request-validator";
import RequestValidator from "@usecases/port/request-validator";
import ResultValidator from "@usecases/port/result-validator";
import ImportJsonTagProductsByPathRequest from '@usecases/tag/v1/domain/import-json-tag-products-by-path-request';
import FileUploadRequest from '@usecases/tag/v1/domain/file-upload-request';

class ImportJsonTagProductsByPathValidator
extends HapiEntityValidator<ImportJsonTagProductsByPathRequest>
implements RequestValidator<ImportJsonTagProductsByPathRequest> {
  constructor() {
    const fileSchema = Joi.object<FileUploadRequest>({
      fieldname: Joi.string().required(),
      originalname: Joi.string().required(),
      encoding: Joi.string().required(),
      mimetype: Joi.string().required(),
      size: Joi.number().min(1).required(),
      buffer: Joi.object().required(),
    });

    const requestSchema = Joi.object<ImportJsonTagProductsByPathRequest>({
      id: Joi.number().min(1).required(),
      file: fileSchema.required(),
    });

    super(requestSchema);
  }

  public validate(request: ImportJsonTagProductsByPathRequest): ResultValidator<ImportJsonTagProductsByPathRequest> {
    return super.validate(request);
  }
}

export default ImportJsonTagProductsByPathValidator
