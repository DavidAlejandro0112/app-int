import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskStatus } from 'src/common/enum/tasks.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(task: Partial<Task>): Promise<Task> {
    const newTask = this.tasksRepository.create(task);
    try {
      return await this.tasksRepository.save(newTask);
    } catch (error) {
      throw new ConflictException('Task could not be created. Please try again.');
    }
  }

  async findAll(): Promise<Task[]> {
    return await this.tasksRepository.find();
  }
  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
    return task;
  }

  async update(id: number, taskData: Partial<Task>): Promise<Task> {
    const existingTask = await this.tasksRepository.findOneBy({ id });
    
    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    try {
      await this.tasksRepository.update(id, taskData);
      return await this.tasksRepository.findOneBy({ id });
    } catch (error) {
      throw new ConflictException('Task could not be updated. Please try again.');
    }
  }

  async remove(id: number): Promise<void> {
    const existingTask = await this.tasksRepository.findOneBy({ id });

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    try {
      await this.tasksRepository.delete(id);
    } catch (error) {
      throw new ConflictException('Task could not be deleted. Please try again.');
    }
  }

  async complete(id: number): Promise<Task> {
    const existingTask = await this.tasksRepository.findOneBy({ id });

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }

    try {
      await this.tasksRepository.update(id, { status: TaskStatus.COMPLETED });
      return await this.tasksRepository.findOneBy({ id });
    } catch (error) {
      throw new ConflictException('Task could not be marked as completed. Please try again.');
    }
  }
}
