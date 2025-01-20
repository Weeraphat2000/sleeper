import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(private readonly model: Model<TDocument>) {}

  async create(data: Omit<TDocument, '_id'>): Promise<TDocument> {
    const document = new this.model({
      ...data,
      _id: new Types.ObjectId(),
    });
    return document.save();
  }

  //   async findAll(): Promise<TDocument[]> {
  //     return this.model.find().exec();
  //   }

  //   async findById(id: string): Promise<TDocument> {
  //     return this.model.findById(id).exec();
  //   }

  //   async update(id: string, data: any): Promise<TDocument> {
  //     return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  //   }

  //   async delete(id: string): Promise<TDocument> {
  //     return this.model.findByIdAndDelete(id).exec();
  //   }

  async findOne(query: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(query).lean<TDocument>(true);
    if (!document) {
      this.logger.error(`Document not found`, query);
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async findOneAndUpdate(
    query: FilterQuery<TDocument>,
    data: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(query, data, { new: true })
      .lean<TDocument>(true);
    if (!document) {
      this.logger.error(`Document not found`, query);
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async find(query: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(query).lean<TDocument[]>(true);
  }

  async findOneAndDelete(query: FilterQuery<TDocument>): Promise<TDocument> {
    return this.model.findOneAndDelete(query).lean<TDocument>(true);
  }
}
