import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity('profiles')
export class Profile {

@PrimaryGeneratedColumn()
    id: number; 

    @Column({ type: 'varchar', length: 100 })
    nombre: string; // Campo para el nombre del perfil

    @Column({ type: 'varchar', unique: true, length: 150 })
    email: string; 

    @OneToOne(() => User, (user) => user.profile)
    user: User;
}