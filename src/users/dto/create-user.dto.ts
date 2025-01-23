import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";



export class CreateUserDto {
    
    @ApiProperty({ 
        description: 'Nombre de usuario',
        example:'David',
        type:'string',minLength:2 ,maxLength:8})
    @IsString()
    @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
    @MaxLength(8, { message: 'El nombre no puede exceder los 8 caracteres.' })
    nombre:string;
    @ApiProperty({ 
        description: 'Correo',
        example:'test@test.com' })
    
    @IsEmail({}, { message: 'El correo electrónico no es válido.' })
    email:string;
    @ApiProperty({ 
        description: 'Password',
        example:'123.Abc' })
    @IsStrongPassword({
        minLength: 8, 
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    @MaxLength(8, {message: 'la contraseña no puede exceder los 8 caracteres'})
    password: string;

}