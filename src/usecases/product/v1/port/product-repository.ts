import Product from "@entities/product";
import GetProductByQueryRequest from "../domain/get-product-by-query-request";
import ProductPaginationResponse from "../domain/product-pagination-response";

export default interface ProductRepository {
  findById: (id: number) => Promise<Product>;
  query: (entity: GetProductByQueryRequest) => Promise<ProductPaginationResponse>;
  save: (entity: Product) => Promise<Product>;
  delete: (id: number) => Promise<void>;
}
