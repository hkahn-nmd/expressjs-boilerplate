import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/createUserRequestBody.dto';
import { LoginDto } from './dtos/loginRequestBody.dto';
import { LoginResponseDto } from './dtos/loginResponse.dto';
import { AccessTokenRequestBodyDto } from './dtos/accessTokenRequestBody.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.createUser(createUserDto);
  }

  @Post('refresh')
  async refresh(
    @Body() accessTokenRequestBodyDto: AccessTokenRequestBodyDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.refresh(accessTokenRequestBodyDto);
  }
}
