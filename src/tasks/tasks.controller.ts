import { Controller, Post, Body, Get, Patch, Param, Delete, ConflictException, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from 'src/common/enum/tasks.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Task created successfully.', type: Task })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
      try {
          const dueDate = new Date(createTaskDto.dueDate);

          const newTask = await this.tasksService.create({ 
            ...createTaskDto, 
            dueDate,
            status: TaskStatus.PENDING 
          });
          await this.tasksService.sendNewTaskTagEmail(newTask.title, createTaskDto.userEmail);
  
          return newTask; 
      } catch (error) {
          throw new ConflictException('Failed to create task or send notification.');
      }
  }
  

  @Get()
  @ApiResponse({ status: 200, description: 'List of tasks.', type: [Task] })
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Get task by ID.', type: Task })
  findOne(@Param('id') id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Task updated successfully.', type: Task })
  update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
    if (updateTaskDto.dueDate) {
      updateTaskDto.dueDate = new Date(updateTaskDto.dueDate);
    }
    return this.tasksService.update(id, {
      ...updateTaskDto,
      status: TaskStatus.PENDING
    });
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Task deleted successfully.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.tasksService.remove(id);
  }

  @Patch('complete/:id')
  @ApiResponse({ status: 200, description: 'Task marked as completed.', type: Task })
  complete(@Param('id') id: number): Promise<Task> {
    return this.tasksService.complete(id);
  }
}
