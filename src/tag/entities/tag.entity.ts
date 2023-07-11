import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: '标签名',
  })
  name: string;

  @Column({
    comment: '支付类型 0-不计入,1-支出,2-收入',
  })
  pay_type: number;

  @ManyToMany(() => User, (user) => user.tags)
  users: User[];
}
