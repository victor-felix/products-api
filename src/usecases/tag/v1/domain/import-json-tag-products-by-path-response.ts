export default ImportJsonTagProductsByPathResponse;
import InvalidDataError from "@usecases/errors/invalid-data-error";
import TagNotFoundError from "@usecases/errors/tag-not-found-error";
import { Either } from "@usecases/helpers/either";

export type ImportJsonTagProductsByPathResponse = Either<InvalidDataError | TagNotFoundError, void>
