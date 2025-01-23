import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('users') 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Crear usuario.',
    description: 'Crear un nuevo usuario.'
  })
  @ApiBody({type: CreateUserDto})
  @ApiResponse({status: 201, description: 'The user has been successfully created.'})
  @ApiResponse({status: 400, description: 'Bad Request.'})
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Mostrar todo',
    description: 'Muestra todos los usuarios en la base de datos'
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Muestra un usuario por el id',
    description: 'muestra un usuario cuando se le pasa por parametros el id'
  })
  @ApiParam({name: 'id', required: true, description: 'ID User'})
  @ApiQuery({name: 'offset', required: false, type: Number, description: 'Numero de registros a omitir', example: 0})
  @ApiQuery({name: 'limit', required: false, type: Number, description: 'Numero maximo que va a retornar.', example: 10})
  @ApiQuery({name: 'search', required: false, type: String, description: 'No dejar espacios en blanco.', example: ''})
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }
  @ApiOperation({
    summary: 'modificar segun el id ',
  })
  @ApiBody({type: UpdateUserDto})
  @ApiParam({name: 'id', required: true, description: 'ID User'})
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }
  @ApiOperation({
    summary: 'Elimina segun el id ',
    description: 'Elimina logicamente un usuario pero se queda en la bd la fecha que se elimino'
  })
  @ApiParam({name: 'id', required: true, description: 'ID User'})
  @ApiQuery({name: 'search', required: false, type: String, description: 'No dejar espacios en blanco.', example: ''})
  @ApiResponse({ status: 204, description: 'Post deleted successfully.' })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}