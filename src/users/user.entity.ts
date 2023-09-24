import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { compare, hash } from 'bcrypt';
import * as jwt from '@nestjs/jwt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  async comparePassword(entryPass: string): Promise<boolean> {
    return await compare(entryPass, this.password);
  }
}
