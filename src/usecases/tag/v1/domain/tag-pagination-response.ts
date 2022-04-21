import TagResponse from "./tag-response";

export default interface TagPaginationResponse {
  data: TagResponse[];
  total: number;
  page_total: number;
  next?: number;
  previous?: number;
}
