import { 
  Injectable, 
  Logger, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { TagType } from 'src/common/enum/tags.enum';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);
  private readonly mailerService: MailerService
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>

  ) {}

  // Crear nueva etiqueta
  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    try {
      const { taskIds, ...tagData } = createTagDto;

      const tag = new Tag();
      tag.name = tagData.name;
      tag.type = tagData.type;
      tag.color = tagData.color;

      // Asociar tareas si se proporcionan IDs
      if (taskIds && taskIds.length > 0) {
        tag.tasks = await this.taskRepository.findBy({ 
          id: In(taskIds) 
        });
      }

      return await this.tagRepository.save(tag);
    } catch (error) {
      this.logger.error('Error creando etiqueta', error);
      throw new BadRequestException('No se pudo crear la etiqueta');
    }
  }

  // Obtener todas las etiquetas de un usuario
  async findAllTagsByUser(userId: number): Promise<Tag[]> {
    try {
      return await this.tagRepository.find({
        where: { userId: { id: userId } }, // Corrección para relaciones
        relations: ['tasks', 'user']
      });
    } catch (error) {
      this.logger.error('Error obteniendo etiquetas', error);
      throw new BadRequestException('No se pudieron obtener las etiquetas');
    }
  }
  

  // Buscar etiqueta por ID
  async findTagById(tagId: number): Promise<Tag> {
    try {
      const tag = await this.tagRepository.findOne({
        where: { id: tagId },
        relations: ['tasks']
      });

      if (!tag) {
        throw new NotFoundException('Etiqueta no encontrada');
      }

      return tag;
    } catch (error) {
      this.logger.error('Error buscando etiqueta', error);
      throw error;
    }
  }

  // Actualizar etiqueta
  async updateTag(tagId: number, updateData: Partial<CreateTagDto>): Promise<Tag> {
    try {
      const tag = await this.findTagById(tagId);

      if (updateData.name) tag.name = updateData.name;
      if (updateData.type) tag.type = updateData.type;
      if (updateData.color) tag.color = updateData.color;

      // Actualizar tareas asociadas si se proporcionan
      if (updateData.taskIds) {
        tag.tasks = await this.taskRepository.findByIds(updateData.taskIds);
      }

      return await this.tagRepository.save(tag);
    } catch (error) {
      this.logger.error('Error actualizando etiqueta', error);
      throw new BadRequestException('No se pudo actualizar la etiqueta');
    }
  }

  // Eliminar etiqueta
  async deleteTag(tagId: number): Promise<void> {
    try {
      const tag = await this.findTagById(tagId);
      await this.tagRepository.remove(tag);
    } catch (error) {
      this.logger.error('Error eliminando etiqueta', error);
      throw new BadRequestException('No se pudo eliminar la etiqueta');
    }
  }

  // Añadir tarea a etiqueta
  async addTaskToTag(tagId: number, taskId: number): Promise<Tag> {
    try {
      const tag = await this.tagRepository.findOne({
        where: { id: tagId },
        relations: ['tasks']
      });

      const task = await this.taskRepository.findOneBy({ id: taskId });

      if (!tag || !task) {
        throw new NotFoundException('Etiqueta o tarea no encontrada');
      }

      // Verificar si la tarea ya está asociada
      if (!tag.tasks.some(t => t.id === taskId)) {
        tag.tasks.push(task);
      }

      return await this.tagRepository.save(tag);
    } catch (error) {
      this.logger.error('Error añadiendo tarea a etiqueta', error);
      throw new BadRequestException('No se pudo añadir la tarea a la etiqueta');
    }
  }

  // Eliminar tarea de etiqueta
  async removeTaskFromTag(tagId: number, taskId: number): Promise<Tag> {
    try {
      const tag = await this.tagRepository.findOne({
        where: { id: tagId },
        relations: ['tasks']
      });

      if (!tag) {
        throw new NotFoundException('Etiqueta no encontrada');
      }

      tag.tasks = tag.tasks.filter(task => task.id !== taskId);

      return await this.tagRepository.save(tag);
    } catch (error) {
      this.logger.error('Error eliminando tarea de etiqueta', error);
      throw new BadRequestException('No se pudo eliminar la tarea de la etiqueta');
    }
  }

  // Buscar etiquetas por tipo
  async findTagsByType(type: TagType): Promise<Tag[]> {
    try {
      return await this.tagRepository.find({
        where: { type },
        relations: ['tasks']
      });
    } catch (error) {
      this.logger.error('Error buscando etiquetas por tipo', error);
      throw new BadRequestException('No se pudieron obtener las etiquetas');
    }
  }

  // Contar etiquetas
  async countTags(): Promise<number> {
    try {
      return await this.tagRepository.count();
    } catch (error) {
      this.logger.error('Error contando etiquetas', error);
      throw new BadRequestException('No se pudo contar las etiquetas');
    }
  }
  async sendNewTaskTagEmail(taskTitle: string, userEmail: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: 'Nueva Tarea Creada',
        text: `Se ha creado una nueva tarea: ${taskTitle}`,
        html: `
          <h1>Nueva Tarea Creada</h1>
          <p>Se ha creado la tarea: <strong>${taskTitle}</strong></p>
          <p>¡Mantente al día con tus actividades!</p>
        `
      });

      this.logger.log(`Notificación de nueva tarea enviada a ${userEmail}`);
    } catch (error) {
      this.logger.error(`Error enviando notificación de nueva tarea: ${error.message}`);
   }
  }
}