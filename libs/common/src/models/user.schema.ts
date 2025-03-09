import { AbstractDocument } from '@app/common/database/abstract.schema';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
@ObjectType()
export class UserDocument extends AbstractDocument {
  @Prop({ required: true })
  @Field()
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  @Field(() => [String], { nullable: true })
  roles?: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
