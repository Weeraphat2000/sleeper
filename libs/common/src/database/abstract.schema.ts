import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
@ObjectType({
  isAbstract: true, // คือ abstract class ที่ไม่สามารถใช้ได้โดยตรง แต่สามารถใช้เป็น base class ให้กับ class อื่นๆได้
})
export abstract class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  @Field(() => String)
  _id: Types.ObjectId;

  // @Prop({ type: Date, default: Date.now })
  // createdAt: Date;

  // @Prop({ type: Date, default: Date.now })
  // updatedAt: Date;
}
