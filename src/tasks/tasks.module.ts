import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TagsModule } from 'src/tags/tags.module';
import { AuthModule } from 'src/auth/auth.module';
import { MailerService } from '@nestjs-modules/mailer';
import { NotificationsModule } from 'src/notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]),
  TagsModule,
  NotificationsModule,
  AuthModule
],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
