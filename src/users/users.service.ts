import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepo:Repository<User>,
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>
  ){}
     
  async create(createUserDto: CreateUserDto): Promise<{ user: User; profile: Profile }> {
    try {
        // Crear el usuario
        const user = this.userRepo.create(createUserDto);
        await this.userRepo.save(user);

        // Crear el perfil
        const profile = this.profileRepo.create({
            nombre: createUserDto.nombre,
            email: createUserDto.email,
        });
        await this.profileRepo.save(profile);

        return { user, profile }; 
    } catch (error) {
        console.error('Error creating user and profile:', error);
        throw new InternalServerErrorException("An error occurred while creating the user and profile.");
    }
}
  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepo.findOne({ where: { email } });
}
  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(id: number) {
    return await this.userRepo.findOneBy({id});
  }

async updateUser(userId: number, updateUserDto:UpdateUserDto): Promise<User> {
    const user = await this.findOne(userId);
    const newPassword = updateUserDto.password;
    if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
    }
    user.password = newPassword; 
    return await this.userRepo.save(user);
}


  async remove(id: number) {
    return await this.userRepo.softDelete({id});
  }
}