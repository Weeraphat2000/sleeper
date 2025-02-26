import { AbstractEntity } from '@app/common/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Reservation extends AbstractEntity<Reservation> {
  @Column({
    type: Date,
    default: () => 'CURRENT_TIMESTAMP',
  })
  timestamp: Date;

  @Column({ type: Date })
  startDate: Date;

  @Column({ type: Date })
  endDate: Date;

  @Column({ type: String })
  invoiceId: string;

  @Column({ type: String })
  userId: number;
}
