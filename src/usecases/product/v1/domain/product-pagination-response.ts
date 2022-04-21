import ProductResponse from "./product-response";

export default interface ProductPaginationResponse {
  data: ProductResponse[];
  total: number;
  page_total: number;
  next?: number;
  previous?: number;
}
