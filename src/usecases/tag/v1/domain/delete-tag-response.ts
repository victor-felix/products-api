import DeleteTagError from "@usecases/errors/delete-tag-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import RelationshipError from "@usecases/errors/relationship-error";
import TagNotFoundError from "@usecases/errors/tag-not-found-error";
import { Either } from "@usecases/helpers/either";

export type DeleteTagResponse = Either<InvalidDataError | DeleteTagError | TagNotFoundError | RelationshipError, void>
