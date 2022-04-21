import Product from "@entities/product";
import GetProductByQueryRequest from "@usecases/product/v1/domain/get-product-by-query-request";
import ProductPaginationResponse from "@usecases/product/v1/domain/product-pagination-response";
import ProductRepository from "@usecases/product/v1/port/product-repository";
import { getRepository, Like } from "typeorm";
import { ProductEntity } from "../schemas/public/product-entity";

class TypeORMProductRepository implements ProductRepository {

  async findById(id: number): Promise<Product> {
    const repository = getRepository<Product>(ProductEntity);

    return repository.findOne({ where: { id }});
  }

  async query(entity: GetProductByQueryRequest): Promise<ProductPaginationResponse> {
    const repository = getRepository<Product>(ProductEntity);

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

    if (entity.tag_id) {
      where = {
        ...where,
        tag: {
          id: entity.tag_id,
        },
      };
    }

    if (entity.tag_name) {
      where = {
        ...where,
        tag: {
          name: Like(`%${entity.tag_name}%`),
        },
      };
    }

    const [data, total] = await repository
    .findAndCount(
      {
        where,
        skip: this.getOffset(entity.skip, entity.take),
        take: entity.take,
        relations: ['tag']
      }
    );

    return {
      data,
      total,
      page_total: data.length,
      next: this.getNext(entity.skip),
      previous: this.getPrevious(entity.skip),
    } as ProductPaginationResponse;
  }

  async save(entity: Product): Promise<Product> {
    const repository = getRepository<Product>(ProductEntity);

    return repository.save(entity);
  }

  async delete(id: number): Promise<void> {
    const repository = getRepository<Product>(ProductEntity);

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

export default TypeORMProductRepository;
