import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateTaskDto {
  @ApiProperty({ description: 'Title of the task', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Description of the task', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Due date of the task', required: false })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  dueDate?: Date;

  @ApiProperty({
    description: 'Status of the task',
    enum: ['pending', 'in progress', 'completed'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['pending', 'in progress', 'completed'])
  status?: 'pending' | 'in progress' | 'completed';
}
