import DeleteProductError from "@usecases/errors/delete-product-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import ProductNotFoundError from "@usecases/errors/product-not-found-error";
import { Either } from "@usecases/helpers/either";

export type DeleteProductResponse = Either<InvalidDataError | DeleteProductError | ProductNotFoundError, void>
