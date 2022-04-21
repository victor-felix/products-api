import CreateProductError from "@usecases/errors/create-product-error";
import InvalidDataError from "@usecases/errors/invalid-data-error";
import { Either } from "@usecases/helpers/either";
import ProductResponse from "./product-response";

export type CreateProductResponse = Either<InvalidDataError | CreateProductError, ProductResponse>
