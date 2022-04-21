import InvalidDataError from "@usecases/errors/invalid-data-error";
import ProductNotFoundError from "@usecases/errors/product-not-found-error";
import { Either } from "@usecases/helpers/either";
import ProductResponse from "./product-response";

export type GetProductByPathResponse = Either<InvalidDataError | ProductNotFoundError, ProductResponse>
