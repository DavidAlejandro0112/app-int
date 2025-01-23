import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";



export class CreateUserDto {
    
    @ApiProperty({ 
        description: 'Username',
        example:'David',
        type:'string',minLength:2 ,maxLength:8})
    @IsString()
    @IsNotEmpty({ message: 'The name cannot be empty.' })
    @MinLength(2, { message: 'The name must have at least 2 characters.' })
    @MaxLength(12, { message: 'The name cannot exceed 12 characters.' })
    nombre:string;
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

}