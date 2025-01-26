import { IsString, IsOptional, IsDateString, IsEnum, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateTaskDto {
  @ApiProperty({ description: 'Title of the task' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the task', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Due date of the task' })
  @IsDateString()
  dueDate: string; 
  @ApiProperty({description:'User email'})
  @IsEmail()
  userEmail:string;

  @ApiProperty({
    description: 'Status of the task',
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending',
  })
  @IsEnum(['pending', 'in progress', 'completed'])
  status: 'pending' | 'in progress' | 'completed';
}
