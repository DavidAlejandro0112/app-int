import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag, User, Task]),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60m' }
        }),
        AuthModule 
      ],
  controllers: [TagsController],
  providers: [TagsService,  AuthGuard],
  exports:[TagsService],
})
export class TagsModule {}
