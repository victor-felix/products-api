import GetProductByQueryError from "@usecases/errors/get-product-by-query-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import { Either } from "@usecases/helpers/either";
import ProductPaginationResponse from "./product-pagination-response";

export type GetProductByQueryResponse = Either<InvalidDataError | GetProductByQueryError, ProductPaginationResponse>
