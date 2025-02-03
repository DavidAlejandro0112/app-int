import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskStatus } from 'src/common/enum/tasks.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { Notifications } from 'src/notification/entities/notification.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,

  ) {}

  async create(task: Partial<Task>): Promise<Task> {
    const newTask = this.tasksRepository.create(task);
    try {
      const savedTask = await this.tasksRepository.save(newTask);
      this.logger.log(`Task created with ID: ${savedTask.id}`);
      return savedTask;
    } catch (error) {
      this.logger.error('Error creating task', error);
      throw new ConflictException('Task could not be created. Please try again.');
    }
  }

  async findAll(): Promise<Task[]> {
    const tasks = await this.tasksRepository.find();
    this.logger.log(`Retrieved ${tasks.length} tasks.`);
    return tasks;
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      this.logger.warn(`Task with ID ${id} not found.`);
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    this.logger.log(`Task found: ${task.id}`);
    return task;
  }

  async update(id: number, taskData: Partial<Task>): Promise<Task> {
    const existingTask = await this.tasksRepository.findOneBy({ id });
    
    if (!existingTask) {
      this.logger.warn(`Attempted to update non-existent task with ID: ${id}`);
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    try {
      await this.tasksRepository.update(id, taskData);
      this.logger.log(`Task with ID ${id} updated.`);
      return await this.tasksRepository.findOneBy({ id });
    } catch (error) {
      this.logger.error('Error updating task', error);
      throw new ConflictException('Task could not be updated. Please try again.');
    }
  }

  async remove(id: number): Promise<void> {
    const existingTask = await this.tasksRepository.findOneBy({ id });

    if (!existingTask) {
      this.logger.warn(`Attempted to delete non-existent task with ID: ${id}`);
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    try {
      await this.tasksRepository.delete(id);
      this.logger.log(`Task with ID ${id} deleted.`);
    } catch (error) {
      this.logger.error('Error deleting task', error);
      throw new ConflictException('Task could not be deleted. Please try again.');
    }
  }

  async complete(id: number): Promise<Task> {
    const existingTask = await this.tasksRepository.findOneBy({ id });

    if (!existingTask) {
      this.logger.warn(`Attempted to complete non-existent task with ID: ${id}`);
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    try {
      await this.tasksRepository.update(id, { status: TaskStatus.COMPLETED });
      this.logger.log(`Task with ID ${id} marked as completed.`);
      return await this.tasksRepository.findOneBy({ id });
    } catch (error) {
      this.logger.error('Error marking task as completed', error);
      throw new ConflictException('Task could not be marked as completed. Please try again.');
    }
  }
}