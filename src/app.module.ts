import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { TagsModule } from './tags/tags.module';
import {  NotificationsModule } from './notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService], 
      useFactory: async (configService: ConfigService) => ({
        type:'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'), 
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, 

      }),
      
    }), 
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    TasksModule,
    TagsModule,
    NotificationsModule, ],
  
    
  controllers: [AppController],
  providers: [AppService],
  exports:[ConfigModule]
})
export class AppModule {}