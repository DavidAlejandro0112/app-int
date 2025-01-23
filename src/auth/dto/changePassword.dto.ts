import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, IsStrongPassword, MinLength } from "class-validator";

export class ChangePasswordDto{
    
    @ApiProperty({ description:'oldpassword', example:'123.Abcd'})
    @Transform(({value}) =>value.trim())
    @IsStrongPassword({
        minLength: 6, 
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    oldpassword: string;
    
    @ApiProperty({ description: 'newpassword', example: '123123'})
    @Transform(({value}) =>value.trim())
    @IsStrongPassword({
        minLength: 6, 
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    newpassword: string;
}