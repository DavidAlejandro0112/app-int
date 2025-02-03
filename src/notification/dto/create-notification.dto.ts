import { IsString, IsBoolean, IsNotEmpty, IsDate, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'El tipo de notificación',
    example: 'new_task',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'El mensaje de la notificación',
    example: 'Nueva tarea creada: Tarea 1',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Indica si la notificación ha sido leída',
    example: false,
    default: false,
  })
  @IsBoolean()
  isRead: boolean;

  @ApiProperty({
    description: 'Fecha de creación de la notificación',
    example: '2023-10-10T10:00:00Z',
  })
  @IsDate()
  @IsOptional()  
  createdAt?: Date;

  @ApiProperty({
    description: 'ID del usuario asociado a la notificación',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;  

  @ApiProperty({
    description: 'ID de la tarea asociada a la notificación',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  taskId: number; 
}
