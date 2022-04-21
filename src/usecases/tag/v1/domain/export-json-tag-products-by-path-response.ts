export default ExportJsonTagProductsByPathResponse;
import InvalidDataError from "@usecases/errors/invalid-data-error";
import TagNotFoundError from "@usecases/errors/tag-not-found-error";
import { Either } from "@usecases/helpers/either";
import FileTagProductsResponse from "./file-tag-products-response";

export type ExportJsonTagProductsByPathResponse = Either<InvalidDataError | TagNotFoundError, FileTagProductsResponse>
