import { AbstractDocument } from '@app/common/database/abstract.schema';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
@ObjectType()
export class ReservationDocument extends AbstractDocument {
  @Prop({ type: Date, default: Date.now })
  @Field()
  timestamp: Date;

  @Prop({ type: Date })
  @Field()
  startDate: Date;

  @Prop({ type: Date })
  @Field()
  endDate: Date;

  @Prop({ type: String })
  @Field()
  invoiceId: string;

  @Prop({ type: String })
  @Field()
  userId: string;
}

export const ReservationSchema =
  SchemaFactory.createForClass(ReservationDocument);
