import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { compare, hash } from 'bcrypt';
import * as jwt from '@nestjs/jwt';
import { Post } from 'src/posts/post.entity';
import { Community } from 'src/community/community.entity';

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

  @OneToMany(() => Post, (post) => post.author)
  post: Post[];

  @ManyToMany(() => Community, (community: Community) => community.members)
  @JoinTable({
    name: 'user_community',
    joinColumn: {
      name: 'member_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'community_id',
      referencedColumnName: 'id',
    },
  })
  communities?: Community[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  async comparePassword(entryPass: string): Promise<boolean> {
    return await compare(entryPass, this.password);
  }
}
