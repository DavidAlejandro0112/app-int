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
import { Task } from 'src/tasks/entities/task.entity';
import { TagType } from 'src/common/enum/tags.enum';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);
 
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>
  ) {}

  async createTag(createTagDto: CreateTagDto): Promise<Tag> {
    try {
      const { taskIds, ...tagData } = createTagDto;
      const tag = new Tag();
      tag.name = tagData.name;
      tag.type = tagData.type;
      tag.color = tagData.color;
      if (taskIds && taskIds.length > 0) {
        tag.tasks = await this.taskRepository.findBy({ 
          id: In(taskIds) 
        });
      }
      return await this.tagRepository.save(tag);
    } catch (error) {
      this.logger.error('Error creating tag', error);
      throw new BadRequestException('Could not create the tag');
    }
  }

  async findAllTagsByUser(userId: number): Promise<Tag[]> {
    try {
      return await this.tagRepository.find({
        where: { userId: { id: userId } },
        relations: ['tasks', 'user']
      });
    } catch (error) {
      this.logger.error('Error retrieving tags', error);
      throw new BadRequestException('Could not retrieve tags');
    }
  }

  async findTagById(tagId: number): Promise<Tag> {
    try {
      const tag = await this.tagRepository.findOne({
        where: { id: tagId },
        relations: ['tasks']
      });

      if (!tag) {
        throw new NotFoundException('Tag not found');
      }
      return tag;
    } catch (error) {
      this.logger.error('Error finding tag', error);
      throw error;
    }
  }

  async updateTag(tagId: number, updateData: Partial<CreateTagDto>): Promise<Tag> {
    try {
      const tag = await this.findTagById(tagId);

      if (updateData.name) tag.name = updateData.name;
      if (updateData.type) tag.type = updateData.type;
      if (updateData.color) tag.color = updateData.color;
      if (updateData.taskIds) {
        tag.tasks = await this.taskRepository.findByIds(updateData.taskIds);
      }

      return await this.tagRepository.save(tag);
    } catch (error) {
      this.logger.error('Error updating tag', error);
      throw new BadRequestException('Could not update the tag');
    }
  }

  async deleteTag(tagId: number): Promise<void> {
    try {
      const tag = await this.findTagById(tagId);
      await this.tagRepository.remove(tag);
    } catch (error) {
      this.logger.error('Error deleting tag', error);
      throw new BadRequestException('Could not delete the tag');
    }
  }

  async addTaskToTag(tagId: number, taskId: number): Promise<Tag> {
    try {
      const tag = await this.tagRepository.findOne({
        where: { id: tagId },
        relations: ['tasks']
      });

      const task = await this.taskRepository.findOneBy({ id: taskId });

      if (!tag || !task) {
        throw new NotFoundException('Tag or task not found');
      }
      if (!tag.tasks.some(t => t.id === taskId)) {
        tag.tasks.push(task);
      }
      return await this.tagRepository.save(tag);
    } catch (error) {
      this.logger.error('Error adding task to tag', error);
      throw new BadRequestException('Could not add the task to the tag');
    }
  }

  async removeTaskFromTag(tagId: number, taskId: number): Promise<Tag> {
    try {
      const tag = await this.tagRepository.findOne({
        where: { id: tagId },
        relations: ['tasks']
      });

      if (!tag) {
        throw new NotFoundException('Tag not found');
      }

      tag.tasks = tag.tasks.filter(task => task.id !== taskId);

      return await this.tagRepository.save(tag);
    } catch (error) {
      this.logger.error('Error removing task from tag', error);
      throw new BadRequestException('Could not remove the task from the tag');
    }
  }

  async findTagsByType(type: TagType): Promise<Tag[]> {
    try {
      return await this.tagRepository.find({
        where: { type },
        relations: ['tasks']
      });
    } catch (error) {
      this.logger.error('Error finding tags by type', error);
      throw new BadRequestException('Could not retrieve tags');
    }
  }

  async countTags(): Promise<number> {
    try {
      return await this.tagRepository.count();
    } catch (error) {
      this.logger.error('Error counting tags', error);
      throw new BadRequestException('Could not count the tags');
    }
  }  
}