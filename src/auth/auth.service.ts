import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcryptjs from 'bcryptjs'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/changePassword.dto'
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';



@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ){}
    async register({ password, email, username }: CreateUserDto) {
        try {
            const user = { password, email, username };
            const existingUser = await this.usersService.findOneByEmail(user.email);
            if (existingUser){
                throw new BadRequestException("Email already exists");
            }
            else{
            const hashedPassword = await bcryptjs.hash(password, 10);
             this.usersService.create({ 
                username,
                email, 
                password: hashedPassword,
            });
            return {
                message: "User created successfully",
            };}
        } catch (error) {
            if (error instanceof BadRequestException ||error.code === '23505') {
                console.error('Created user error:' , error.message);
                throw error;
            }
            throw new InternalServerErrorException("An unexpected error occurred during registration");
        }
    }
    async login({ email, password }: LoginDto) {
        try {
            const user = await this.usersService.findOneByEmail(email);
            if (!user) {
                throw new UnauthorizedException("Invalid email");
            }
             console.log(password, user.password);
             
            const isPasswordValid = await bcryptjs.compare(password,user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException("Invalid password");
            }
            const payload = { email: user.email };
            const token = await this.jwtService.signAsync(payload,{secret:process.env.JWT_SECRET});
            return {
                token: token,
                email: user.email,
            };
        } catch (error) {
            console.error('Login error:', error);
            if (error instanceof UnauthorizedException) {
                console.error(' Authentication error:', error.message);
                throw error;
            }
            throw new InternalServerErrorException("An unexpected error occurred during login");
        }
    }
    async changePassword(userId: number, { oldpassword, newpassword }:ChangePasswordDto) {
        try {
            const user = await this.usersService.findOne(userId);
            if (!user) {
                throw new NotFoundException("User not found");
            }
            const isOldPasswordValid = await bcryptjs.compare(oldpassword, user.password);
            if (!isOldPasswordValid) {
                throw new UnauthorizedException("Invalid old password");
            }
            const hashedNewPassword = await bcryptjs.hash(newpassword, 10);
            await this.usersService.updateUser(userId, hashedNewPassword);
            return {
                message: "Password changed successfully",
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException("An unexpected error occurred while changing the password");
        }
    }
    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { email, newPassword } = resetPasswordDto;
        try {
            const user = await this.usersService.findOneByEmail(email);
            if (!user) {
                throw new NotFoundException('User not found');
            }
            const resetToken = this.jwtService.sign({ id: user.id }, { secret: process.env.JWT_SECRET });
            const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await this.usersService.updateUser(user.id, hashedNewPassword);
            return {
                message: 'Password has been reset successfully',
                resetToken,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error; 
            }
            console.error('Problem resetting password:', error);
            throw new InternalServerErrorException('An unexpected error occurred while resetting the password');
        }
    }
}

