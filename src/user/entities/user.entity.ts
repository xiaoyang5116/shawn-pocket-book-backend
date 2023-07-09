import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    comment: '用户名',
  })
  username: string;

  @Column({
    length: 20,
    comment: '密码',
  })
  password: string;

  @Column({
    comment: '头像',
  })
  avatar: string;

  @Column({
    length: 20,
    nullable: true,
    comment: '个性签名',
  })
  signature?: string;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;
}
