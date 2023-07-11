import { Tag } from 'src/tag/entities/tag.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Bill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'double',
    comment: '账单价格',
  })
  amount: number;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @Column({ comment: '账单备注', nullable: true })
  remark: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Tag)
  tag: Tag;
}
