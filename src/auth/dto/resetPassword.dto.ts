import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class ResetPasswordDto {
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'password', example: '123.Abcd'})
    @Transform(({value}) =>value.trim())
    @IsStrongPassword({
        minLength: 8, 
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    newPassword: string;
}