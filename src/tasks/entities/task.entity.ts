import { TaskPriority, TaskStatus } from 'src/common/enum/tasks.enum';
import { Notifications } from 'src/notification/entities/notification.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity('task')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING
  })
  status: TaskStatus;
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM
  })
  priority: TaskPriority;
  
  
  @ManyToOne(() => User, (user) => user.tasks,{
     onDelete: 'CASCADE'
  })
  userId: User;
  @ManyToMany(() => Tag, (tag) => tag.tasks)
  @JoinTable() 
  tags: Tag[];
  
  @OneToMany(() => Notifications, (notification)=> notification.task,)
  notifications: Notifications[];

}
