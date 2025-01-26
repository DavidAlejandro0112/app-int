import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { 
  IsArray, 
  IsNumber, 
  IsOptional, 
  IsString, 
  IsEnum, 
  IsDate 
} from "class-validator";
import { TagType } from "src/common/enum/tags.enum";


export class CreateTagDto {
    @ApiProperty({ 
      description: 'ID del usuario que crea la etiqueta', 
      type: Number, 
      required: false 
    })
    @IsNumber()
    userId: number;

    @ApiProperty({ 
      description: 'IDs de tareas asociadas', 
      type: [Number], 
      required: false 
    })
    @IsArray()
    @IsNumber({}, { each: true })
    taskIds: number[];

    @ApiProperty({ 
      description: 'Nombre de la etiqueta', 
      type: String, 
      required: true 
    })
    @IsString()
    name: string;
   
    @ApiProperty({ 
      description: 'Tipo de etiqueta', 
      enum: TagType, 
      required: true 
    })
    @IsEnum(TagType)
    type: TagType;
   
    @ApiProperty({ 
      description: 'Color de la etiqueta', 
      type: String, 
      required: false 
    })
    @IsOptional()
    @IsString()
    color?: string;
   
    @ApiProperty({ 
      description: 'Fecha de creación', 
      type: Date, 
      required: false 
    })
    @IsDate()
    @Type(() => Date)
    createdAt: Date;
}

 