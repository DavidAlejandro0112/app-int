import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import {  In, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Notifications } from './entities/notification.entity';


@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private notificationsRepository: Repository<Notifications>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async notifyNewTask(userId: number, task: Task): Promise<Notifications> {
    try {
      const notification = this.notificationsRepository.create({
        type: 'new_task',
        message: `Nueva tarea creada: ${task.title}`,
        createdAt: new Date(),
        user: { id: userId } as User,
        task: task
      });

      return await this.notificationsRepository.save(notification);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la notificación');
    }
  }
  async sendTaskReminder(id: number): Promise<Notifications | null> {
    try {
      const task = await this.tasksRepository.findOne(
        { where:{ id },
            relations: ['user']
          });

      if (!task || task.status === 'completed') return null;

      const notification = this.notificationsRepository.create({
        type: 'task_reminder',
        message: `Recordatorio: La tarea "${task.title}" vence el ${task.dueDate.toLocaleDateString()}`,
        createdAt: new Date(),
        user: task.userId,
        task: task
      });

      return await this.notificationsRepository.save(notification);
    } catch (error) {
      throw new InternalServerErrorException('Error al enviar el recordatorio de tarea');
    }
  }

  @Cron('0 9 * * *')
  async checkDueTasks() {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const tasks = await this.tasksRepository.createQueryBuilder('task')
        .where('task.dueDate BETWEEN :start AND :end', {
          start: new Date(),
          end: tomorrow
        })
        .andWhere('task.status != :status', { status: 'completed' })
        .getMany();

      for (const task of tasks) {
        await this.sendTaskReminder(task.id);
      }
    } catch (error) {
      throw new InternalServerErrorException('Error al verificar tareas vencidas');
    }
  }

  async getUserNotifications(userId: number): Promise<Notifications[]> {
    try {
      return await this.notificationsRepository.find({
        where: { user: { id: userId } },  // Ajustado para usar el objeto user
        order: { createdAt: 'DESC' },
        relations: ['task']
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las notificaciones del usuario');
    }
  }

  async markAsRead(id: number): Promise<Notifications> {
    try {
      const updateResult = await this.notificationsRepository.update(id, { isRead: true });

      if (updateResult.affected === 0) {
        throw new NotFoundException('Notificación no encontrada');
      }

      return await this.notificationsRepository.findOne({
        where: { id },
        relations: ['task'],
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al marcar la notificación como leída');
    }
  }
}