import InvalidDataError from "@usecases/errors/invalid-data-error";
import TagNotFoundError from "@usecases/errors/tag-not-found-error";
import UpdateTagError from "@usecases/errors/update-tag-error";
import { Either } from "@usecases/helpers/either";
import TagResponse from "./tag-response";

export type UpdateTagResponse = Either<
  | InvalidDataError
  | UpdateTagError
  | TagNotFoundError,
  TagResponse
>;
