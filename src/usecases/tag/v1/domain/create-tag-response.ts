import CreateTagError from "@usecases/errors/create-tag-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import TagAlreadyExistsError from "@usecases/errors/tag-already-exists-error";
import { Either } from "@usecases/helpers/either";
import TagResponse from "./tag-response";

export type CreateTagResponse = Either<InvalidDataError | CreateTagError | TagAlreadyExistsError, TagResponse>
