import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity('profiles')
export class Profile {

@PrimaryGeneratedColumn()
    id: number; 

    @Column({ nullable: true })
    firstName: string;
  
    @Column({ nullable: true })
    lastName: string;
  
    @Column({ nullable: true })
    address?: string;
  
    @Column({ nullable: true })
    phoneNumber: string;
  
    @Column({ nullable: true })
    birthDate?: Date;
    


    @OneToOne(() => User, (user) => user.profile)
    userId: User;
}