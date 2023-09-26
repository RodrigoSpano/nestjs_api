import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Community {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  ownerId: number;

  @Column({ default: 0 })
  followers: number;

  @ManyToMany(() => User, (user: User) => user.communities)
  members?: User[];
}
