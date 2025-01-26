import { 
  Controller, 
  Post, 
  Get, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Tag } from './entities/tag.entity';

 // Asume que tienes un guard de autenticación

@ApiTags('Etiquetas')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva etiqueta' })
  @ApiResponse({ 
    status: 201, 
    description: 'Etiqueta creada', 
    type: Tag 
  })
  async createTag(
    @Body() createTagDto: CreateTagDto,
    @Request() req
  ): Promise<Tag> {
    createTagDto.userId = req.user.id;
    return this.tagsService.createTag(createTagDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las etiquetas del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de etiquetas', 
    type: [Tag] 
  })
  async findAllTags(@Request() req): Promise<Tag[]> {
    return this.tagsService.findAllTagsByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una etiqueta por ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Detalles de la etiqueta', 
    type: Tag 
  })
  async findTagById(@Param('id') tagId: number): Promise<Tag> {
    return this.tagsService.findTagById(tagId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una etiqueta' })
  @ApiResponse({ 
    status: 200, 
    description: 'Etiqueta actualizada', 
    type: Tag 
  })
  async updateTag(
    @Param('id') tagId: number,
    @Body() updateData: Partial<CreateTagDto>
  ): Promise<Tag> {
    return this.tagsService.updateTag(tagId, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una etiqueta' })
  @ApiResponse({ 
    status: 200, 
    description: 'Etiqueta eliminada' 
  })
  async deleteTag(@Param('id') tagId: number): Promise<void> {
    return this.tagsService.deleteTag(tagId);
  }
}
