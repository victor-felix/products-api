import InvalidDataError from "@usecases/errors/invalid-data-error";
import ProductNotFoundError from "@usecases/errors/product-not-found-error";
import UpdateProductError from "@usecases/errors/update-product-error";
import { Either } from "@usecases/helpers/either";
import ProductResponse from "./product-response";

export type UpdateProductResponse = Either<
  | InvalidDataError
  | UpdateProductError
  | ProductNotFoundError,
  ProductResponse
>;
