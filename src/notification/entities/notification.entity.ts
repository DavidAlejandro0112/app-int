import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';


@Entity()
export class Notifications {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
type: string;  

  @Column()
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, user => user.notifications)
  user:User;

  @ManyToOne(() => Task, task => task.notifications)
  task: Task; 
}
