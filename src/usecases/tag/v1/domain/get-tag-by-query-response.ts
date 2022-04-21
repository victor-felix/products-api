import GetTagByQueryError from "@usecases/errors/get-tag-by-query-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import { Either } from "@usecases/helpers/either";
import TagPaginationResponse from "./tag-pagination-response";

export type GetTagByQueryResponse = Either<InvalidDataError | GetTagByQueryError, TagPaginationResponse>
