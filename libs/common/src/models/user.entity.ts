import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { AbstractEntity } from '../database/abstract.entity';
import { Role } from './role.entity';

// Entity Role
@Entity() // บอก TypeORM ว่า class นี้เป็น Table ใน Database
export class User extends AbstractEntity<User> {
  @Column({ unique: true }) // กำหนดคอลัมน์ email ใน Table User และกำหนดให้เป็น unique
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Role, { cascade: true }) // Many-to-Many ระหว่าง User กับ Role
  // cascade: true -> ถ้าสร้าง/อัปเดต User, Role ที่เกี่ยวข้องก็จะถูกสร้าง/อัปเดตไปด้วย
  // กรณีที่สร้างให้อัตโนมัติ User และ Role มีความสัมพันธ์แบบ @ManyToMany
  @JoinTable() // ใช้ @JoinTable() เพื่อให้ TypeORM สร้างตารางกลาง (mapping table) เก็บความสัมพันธ์ระหว่าง User กับ Role
  roles?: Role[];
}
