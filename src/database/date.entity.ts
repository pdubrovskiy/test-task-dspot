import { AfterInsert, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

export abstract class DateEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @AfterInsert()
  transformId() {
    this.id = typeof this.id === 'string' ? parseInt(this.id, 10) : this.id;
  }
}
