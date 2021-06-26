import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import { GetUser } from './get-user.decorator';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @Post('/login')
    @UsePipes(ValidationPipe)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }


    @Get("/users")
    getusers() {
        return this.authService.getUsers()
    }


    @Get("/users/search")
    @UseGuards(AuthGuard())
    searchUsers(@GetUser() user: User, @Query('query') query: string,) {
        return this.authService.searchUsers(query, user)
    }


    @Post('/signup')
    @UsePipes(ValidationPipe)
    signUp(@Body() createUserDto: CreateUserDto) {
        return this.authService.signUp(createUserDto);
    }
}
