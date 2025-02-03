import { Body, Logger, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from "./guard/auth.guard";
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { RolesGuard } from './guard/roles.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.authService.register(createUserDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto);
    }
    
    @Get('profile')
    @UseGuards(AuthGuard, RolesGuard)
    profile(@Request() req) {
        return req.user;
    }
    @HttpCode(HttpStatus.OK)
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return await this.authService.resetPassword(resetPasswordDto);
    }
    @HttpCode(HttpStatus.OK)
    @Post('change-password')
    @UseGuards(AuthGuard, RolesGuard)
    async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
        const userId = req.user.id;
        return await this.authService.changePassword(userId, changePasswordDto);
    }
}