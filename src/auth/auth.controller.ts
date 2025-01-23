import { Body ,Logger, ConflictException, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from "./guard/auth.guard";
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService
    ) {}

    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    async register(
        @Body() createUserDto: CreateUserDto
    ) {
        try {
            return await this.authService.register(createUserDto);
        } catch (error) {
            this.logger.error(`Registration error: ${error.message}`);
            
            if (error instanceof ConflictException) {
                throw new ConflictException('User already exists');
            }
            
            throw new InternalServerErrorException('Registration failed');
        }
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        try {
            return await this.authService.login(loginDto);
        } catch (error) {
            this.logger.error(`Login error: ${error.message}`);
            
            if (error instanceof UnauthorizedException) {
                throw new UnauthorizedException('Invalid credentials');
            }
            
            throw new InternalServerErrorException('Login failed');
        }
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    profile(@Request() req) {
        return req.user;
    }

    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        try {
            return await this.authService.resetPassword(resetPasswordDto);
        } catch (error) {
            this.logger.error(`Reset password error: ${error.message}`);
            
            if (error instanceof NotFoundException) {
                throw new NotFoundException('User not found');
            }
            
            throw new InternalServerErrorException('Password reset failed');
        }
    }

    @Post('change-password')
    @UseGuards(AuthGuard)
    async changePassword(
        @Request() req,
        @Body() changePasswordDto: ChangePasswordDto
    ) {
        try {
            const userId = req.user.id;
            return await this.authService.changePassword(userId, changePasswordDto);
        } catch (error) {
            this.logger.error(`Change password error: ${error.message}`);
            
            if (error instanceof UnauthorizedException) {
                throw new UnauthorizedException('Invalid current password');
            }
            
            if (error instanceof NotFoundException) {
                throw new NotFoundException('User not found');
            }
            
            throw new InternalServerErrorException('Password change failed');
        }
    }
}
