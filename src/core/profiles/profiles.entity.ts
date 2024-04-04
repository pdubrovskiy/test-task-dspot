import { DateEntity } from 'src/database/date.entity';
import { Entity, Column, JoinTable, ManyToMany } from 'typeorm';

@Entity('profiles')
export class Profiles extends DateEntity {
  @Column()
  img: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column()
  available: boolean;

  @ManyToMany(() => Profiles)
  @JoinTable({
    name: 'friends',
    joinColumn: { name: 'profileId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'friendId', referencedColumnName: 'id' },
  })
  friends: Profiles[];
}
