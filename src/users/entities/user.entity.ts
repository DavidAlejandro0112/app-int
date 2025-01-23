import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { Role } from "src/common/enum/roles.enum";

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    id:number;
   
    @Column({nullable: false, type: 'varchar', length: 255 })
    nombre:string;

    @Column({type: 'varchar', unique: true, length: 150, nullable: false})
    email:string;
    
    @Column({nullable: false, type: 'varchar', length: 255 })
    password:string;   
    
    @Column({ type: 'enum', enum: Role, default: Role.USER })
      role: Role;
      
    @DeleteDateColumn()
    deleteAt:Date;

    @OneToOne(() => Profile, (profile) => profile.user, {
        eager: true, cascade: true, onDelete: 'CASCADE'
    })
    @JoinColumn()
    profile?: Profile;
}