import InvalidDataError from "@usecases/errors/invalid-data-error";
import TagNotFoundError from "@usecases/errors/tag-not-found-error";
import { Either } from "@usecases/helpers/either";
import TagResponse from "./tag-response";

export type GetTagByPathResponse = Either<InvalidDataError | TagNotFoundError, TagResponse>
