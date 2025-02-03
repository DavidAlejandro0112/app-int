import { 
  Controller, 
  Post, 
  Get,  
  Delete, 
  Param, 
  Body,
  Patch,
  BadRequestException,
  UseGuards, 
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TagType } from 'src/common/enum/tags.enum';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@ApiTags('tags')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva etiqueta' })
  @ApiResponse({ status: 201, description: 'Etiqueta creada exitosamente', type: Tag })
  @ApiResponse({ status: 400, description: 'Error al crear la etiqueta' })
  async create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return this.tagsService.createTag(createTagDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Obtener todas las etiquetas de un usuario' })
  @ApiResponse({ status: 200, description: 'Etiquetas obtenidas exitosamente', type: [Tag] })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findAll(@Param('userId') userId: number): Promise<Tag[]> {
    return this.tagsService.findAllTagsByUser(userId);
  }

  @Get(':tagId')
  @ApiOperation({ summary: 'Obtener una etiqueta por ID' })
  @ApiResponse({ status: 200, description: 'Etiqueta obtenida exitosamente', type: Tag })
  @ApiResponse({ status: 404, description: 'Etiqueta no encontrada' })
  async findOne(@Param('tagId') tagId: number): Promise<Tag> {
    return this.tagsService.findTagById(tagId);
  }

  @Patch(':tagId')
  @ApiOperation({ summary: 'Actualizar una etiqueta' })
  @ApiResponse({ status: 200, description: 'Etiqueta actualizada exitosamente', type: Tag })
  @ApiResponse({ status: 404, description: 'Etiqueta no encontrada' })
  @ApiResponse({ status: 400, description: 'Error al actualizar la etiqueta' })
  async update(@Param('tagId') tagId: number, @Body() updateData: Partial<CreateTagDto>): Promise<Tag> {
    return this.tagsService.updateTag(tagId, updateData);
  }

  @Delete(':tagId')
  @ApiOperation({ summary: 'Eliminar una etiqueta' })
  @ApiResponse({ status: 204, description: 'Etiqueta eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Etiqueta no encontrada' })
  async remove(@Param('tagId') tagId: number): Promise<void> {
    return this.tagsService.deleteTag(tagId);
  }

  @Post(':tagId/tasks/:taskId')
  @ApiOperation({ summary: 'Añadir una tarea a una etiqueta' })
  @ApiResponse({ status: 200, description: 'Tarea añadida a la etiqueta', type: Tag })
  @ApiResponse({ status: 404, description: 'Etiqueta o tarea no encontrada' })
  @ApiResponse({ status: 400, description: 'Error al añadir la tarea a la etiqueta' })
  async addTask(@Param('tagId') tagId: number, @Param('taskId') taskId: number): Promise<Tag> {
    return this.tagsService.addTaskToTag(tagId, taskId);
  }

  @Delete(':tagId/tasks/:taskId')
  @ApiOperation({ summary: 'Eliminar una tarea de una etiqueta' })
  @ApiResponse({ status: 200, description: 'Tarea eliminada de la etiqueta', type: Tag })
  @ApiResponse({ status: 404, description: 'Etiqueta no encontrada' })
  @ApiResponse({ status: 400, description: 'Error al eliminar la tarea de la etiqueta' })
  async removeTask(@Param('tagId') tagId: number, @Param('taskId') taskId: number): Promise<Tag> {
    return this.tagsService.removeTaskFromTag(tagId, taskId);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Buscar etiquetas por tipo' })
  @ApiResponse({ status: 200, description: 'Etiquetas obtenidas por tipo', type: [Tag] })
  async findByType(@Param('type') type: string): Promise<Tag[]> {
    const tagType = TagType[type as keyof typeof tagType]; 
    if (!tagType) {
      throw new BadRequestException('Tipo de etiqueta no válido');
    }
    return this.tagsService.findTagsByType(tagType);
  }

  @Get('count')
  @ApiOperation({ summary: 'Contar todas las etiquetas' })
  @ApiResponse({ status: 200, description: 'Número total de etiquetas' })
  async count(): Promise<number> {
    return this.tagsService.countTags();
  }
}