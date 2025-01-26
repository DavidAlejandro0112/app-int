import { Column, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { Role } from "src/common/enum/roles.enum";
import { Task } from "src/tasks/entities/task.entity";
import { Tag } from "src/tags/entities/tag.entity";
import { UserStatus } from "src/common/enum/user.enum";

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    id:number;
   
    @Column({
      nullable: false, 
      default: 'usuario_default', 
      type: 'varchar',
      length: 255
    })
    username:string;

    @Column({
      type: 'varchar',
      unique: true,
      length: 150,
      nullable: false
    })
    email:string;
    
    @Column({
      nullable: false, 
      type: 'varchar', 
      length: 255,  
      select: false 
    })
    password:string;   
    
    @Column({ 
      type: 'enum',
       enum: Role,
        default: Role.USER
      })
      role: Role;
      @Column({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.ACTIVE
      })
      status: UserStatus;
      
    @DeleteDateColumn()
    deleteAt:Date;

    @OneToOne(() => Profile, (profile) => profile.userId, {
        eager: true, cascade: true, onDelete: 'CASCADE'
    })
    @JoinColumn()
    profile?: Profile;
    @OneToMany(() => Task, (task) => task.userId, {
      eager: true, cascade: true, onDelete: 'CASCADE'
    })
    tasks: Task[];
    @OneToMany(() => Tag, (tag) => tag.userId,{
      eager: true, cascade: true, onDelete: 'CASCADE'
    })
    tags:Tag[];
}