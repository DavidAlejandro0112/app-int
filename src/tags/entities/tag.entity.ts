import { TagType } from 'src/common/enum/tags.enum';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';


@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: TagType,
    unique: true
  })
  type: TagType;

  @Column({ nullable: true })
  color?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.tags)
  userId: User;

  @ManyToMany(() => Task, task => task.tags)
  @JoinTable() 
  tasks: Task[];
}
