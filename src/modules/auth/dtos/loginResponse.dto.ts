import { UserResponseDto } from '@/modules/users/dtos/userResponse.dto';

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserResponseDto;

  constructor(loginResponse: any) {
    this.accessToken = loginResponse.accessToken;
    this.refreshToken = loginResponse.refreshToken;
    this.user = new UserResponseDto(loginResponse.user);
  }
}
