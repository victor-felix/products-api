import Controller from "@adapters/controllers/port/controller";
import HttpRequest from "@adapters/controllers/port/http-request";
import HttpResponse from "@adapters/controllers/port/http-response";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import RelationshipError from "@usecases/errors/relationship-error";
import UseCase, { RequestAndResponse } from "@usecases/port/use-case";
import ExportJsonTagProductsByPathRequest from "@usecases/tag/v1/domain/export-json-tag-products-by-path-request";
import ExportJsonTagProductsByPathResponse from "@usecases/tag/v1/domain/export-json-tag-products-by-path-response";
import { inject, injectable } from "tsyringe";

@injectable()
class ExportJsonTagProductsByPathController extends Controller {
  private readonly useCase:
    UseCase<RequestAndResponse<ExportJsonTagProductsByPathRequest, ExportJsonTagProductsByPathResponse>>;

  constructor(
    @inject('ExportJsonTagProductsByPathUseCase') useCase:
      UseCase<RequestAndResponse<ExportJsonTagProductsByPathRequest, ExportJsonTagProductsByPathResponse>>
  ) {
    super();
    this.useCase = useCase;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const request: ExportJsonTagProductsByPathRequest = {
        ...httpRequest.params,
      };

      const response = await this.useCase.execute(request);

      if (response.isLeft() && response.value instanceof InvalidDataError) {
        return this.unprocessableEntity(response.value as InvalidDataError);
      }

      if (response.isLeft() && response.value instanceof RelationshipError) {
        return this.badRequest(response.value as RelationshipError);
      }

      return this.ok(response.value);
    } catch (error) {
      return this.serverError('Internal error');
    }
  }
}

export default ExportJsonTagProductsByPathController;
