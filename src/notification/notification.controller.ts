import { Controller, Post, Get, Param, Patch, Body, NotFoundException } from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { Notifications } from './entities/notification.entity';


@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('new-task')
  async notifyNewTask(
    @Body('userId') userId: number,
    @Body('task') task: any,
  ): Promise<Notifications> {
    return this.notificationsService.notifyNewTask(userId, task);
  }

  @Post('send-reminder/:taskId')
  async sendTaskReminder(@Param('taskId') taskId: number): Promise<Notifications | null> {
    return this.notificationsService.sendTaskReminder(taskId);
  }

  @Get('user/:userId')
  async getUserNotifications(@Param('userId') userId: number): Promise<Notifications[]> {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: number): Promise<Notifications> {
    const notification = await this.notificationsService.markAsRead(id);
    if (!notification) {
      throw new NotFoundException('Notificación no encontrada');
    }
    return notification;
  }
}