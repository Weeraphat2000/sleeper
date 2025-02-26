import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class AbstractEntity<T> {
  @PrimaryGeneratedColumn() // กำหนดให้ id เป็น Primary Key และให้ TypeORM Generate ค่าให้อัตโนมัติ
  id: number;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
