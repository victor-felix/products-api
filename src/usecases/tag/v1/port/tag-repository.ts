import Tag from "@entities/tag";
import TagPaginationResponse from "../domain/tag-pagination-response";

export default interface TagRepository {
  findById: (id: number) => Promise<Tag>;
  findByIdWithRelation: (id: number) => Promise<Tag>;
  findByName: (name: string) => Promise<Tag>;
  query: (entity: Tag) => Promise<TagPaginationResponse>;
  save: (entity: Tag) => Promise<Tag>;
  delete: (id: number) => Promise<void>;
}
