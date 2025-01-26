import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";



export class CreateUserDto {
    
    @ApiProperty({ 
        description: 'Username',
        example:'David',
        type:'string',minLength:2 ,maxLength:8})
     @IsString()
     @IsNotEmpty({ message: 'The name cannot be empty.' })
     @MinLength(2, { message: 'The name must have at least 2 characters.' })
     @MaxLength(12, { message: 'The name cannot exceed 12 characters.' })
    username:string;
    @ApiProperty({ 
        description: 'Email',
        example:'test@test.com' })
    
     @IsEmail({}, { message: 'The email is not valid.' })
    email:string;
    @ApiProperty({ 
        description: 'Password',
        example:'123.Abcd' })
     @IsStrongPassword({
        minLength: 8, 
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
     @MaxLength(8, {message: 'The password cannot exceed 8 characters'})
    password: string;
    @ApiProperty({ 
        description: 'Nombre del usuario', 
        required: false,
        example: 'Juan' 
      })
      @IsString()
      firstName?: string;
    @ApiProperty({ 
        description: 'Apellido del usuario', 
        required: false,
        example: 'Pérez' 
      })
      
      @IsString()
      lastName?: string;
    
    @ApiProperty({ 
        description: 'Dirección', 
        required: false,
        example: 'Calle Falsa 123' 
      })
      @IsOptional()
      @IsString()
      address?: string;
      @ApiProperty({ 
        description: 'Número de teléfono', 
        required: false,
        example: '+541234567890' 
      })
      @IsPhoneNumber()
      phoneNumber?: string;
    
      @ApiProperty({ 
        description: 'Fecha de nacimiento', 
        required: false,
        example: '1990-01-01' 
      })
      @IsOptional()
      @Type(() => Date)
      @IsDate()
      birthDate?: Date;
      @ApiProperty({ 
        description: 'ID de usuario asociado', 
        required: false,
        example: 1 
      })
      @IsOptional()
      userId?: number;
}
    
