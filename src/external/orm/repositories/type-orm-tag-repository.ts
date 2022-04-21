import Tag from "@entities/tag";
import GetTagByQueryRequest from "@usecases/tag/v1/domain/get-tag-by-query-request";
import TagPaginationResponse from "@usecases/tag/v1/domain/tag-pagination-response";
import TagRepository from "@usecases/tag/v1/port/tag-repository";
import { getRepository, Like } from "typeorm";
import { TagEntity } from "../schemas/public/tag-entity";

class TypeORMTagRepository implements TagRepository {

  async findById(id: number): Promise<Tag> {
    const repository = getRepository<Tag>(TagEntity);

    return repository.findOne({ where: { id } });
  }

  async findByIdWithRelation(id: number): Promise<Tag> {
    const repository = getRepository<Tag>(TagEntity);

    return repository.findOne({ where: { id }, relations: ['products'] });
  }

  async findByName(name: string): Promise<Tag> {
    const repository = getRepository<Tag>(TagEntity);

    return repository.findOne({ where: { name }});
  }

  async query(entity: GetTagByQueryRequest): Promise<TagPaginationResponse> {
    const repository = getRepository<Tag>(TagEntity);

    let where = {};

    if (entity.id) {
      where = {
        ...where,
        id: entity.id,
      };
    }

    if (entity.name) {
      where = {
        ...where,
        name: Like(`%${entity.name}%`),
      };
    }

    const [data, total] = await repository
    .findAndCount(
      {
        where,
        skip: this.getOffset(entity.skip, entity.take),
        take: entity.take,
      }
    );

    return {
      data,
      total,
      page_total: data.length,
      next: this.getNext(entity.skip),
      previous: this.getPrevious(entity.skip),
    } as TagPaginationResponse;
  }

  async save(entity: Tag): Promise<Tag> {
    const repository = getRepository<Tag>(TagEntity);

    return repository.save(entity);
  }

  async delete(id: number): Promise<void> {
    const repository = getRepository<Tag>(TagEntity);

    repository.delete(id);
  }

  private getOffset(skip: number, take: number): number {
    const offset = (skip - 1) * take;

    return offset;
  }

  private getNext(skip: number): number {
    const next = Number(skip) + 1;

    return next;
  }

  private getPrevious(skip: number): number {
    if (skip <= 1) {
      return 1;
    }

    const previous = skip - 1;

    return previous;
  }
}

export default TypeORMTagRepository;
