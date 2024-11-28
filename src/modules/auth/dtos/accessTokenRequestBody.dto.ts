import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenRequestBodyDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
