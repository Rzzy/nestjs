import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Logs {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  path: string;
  @Column()
  method: string;
  @Column()
  data: string;
  @Column()
  result: number;
  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn() // 可以省略
  user: User;
}
