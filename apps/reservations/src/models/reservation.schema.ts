import { AbstractDocument } from '@app/common/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class ReservationDocument extends AbstractDocument {
  @Prop({ type: Date, default: Date.now })
  timestamp: Date;

  @Prop({ type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop({ type: String })
  userId: string;

  @Prop({ type: String })
  placeId: string;

  @Prop({ type: String })
  inviteId: string;
}

export const ReservationSchema =
  SchemaFactory.createForClass(ReservationDocument);
