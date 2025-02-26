// import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractEntity } from './abstract.entity';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity<T>> {
  protected abstract readonly logger: Logger;

  constructor(
    private readonly entityRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(entity: T): Promise<T> {
    console.log('entity', entity);
    return this.entityManager.save(entity);
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>, // คือ การ join table ที่เราต้องการ เพื่อดึงข้อมูลที่เกี่ยวข้องมาด้วย
  ): Promise<T> {
    console.log('where', where);
    const entity = await this.entityRepository.findOne({ where, relations });
    if (!entity) {
      this.logger.error(`Entity not found`, where);
      throw new NotFoundException('Entity not found');
    }
    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    console.log('where', where);
    console.log('partialEntity', partialEntity);
    const entity = await this.entityRepository.update(where, partialEntity);
    if (!entity.affected) {
      this.logger.error(`Entity not found`, where);
      throw new NotFoundException('Entity not found');
    }
    return this.findOne(where);
  }

  async find(where: FindOptionsWhere<T>): Promise<T[]> {
    console.log('where', where);
    return this.entityRepository.findBy(where);
  }

  async findOneAndDelete(where: FindOptionsWhere<T>): Promise<T> {
    console.log('where', where);
    const entity = await this.entityRepository.findOne({ where });
    if (!entity) {
      this.logger.error(`Entity not found`, where);
      throw new NotFoundException('Entity not found');
    }
    await this.entityRepository.delete(entity.id);
    return entity;
  }
}
