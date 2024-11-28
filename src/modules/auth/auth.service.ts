import { RefreshTokensRepository } from './../refreshTokens/refreshTokens.repository';
import { UsersRepository } from './../users/users.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUserRequestBody.dto';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto } from './dtos/loginResponse.dto';
import { LoginDto } from './dtos/loginRequestBody.dto';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/schemas/user.schema';
import { AccessTokenRequestBodyDto } from './dtos/accessTokenRequestBody.dto';
import mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    // Check if user already exists
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    return new LoginResponseDto({ accessToken, refreshToken, user });
  }

  async createUser(createUserDto: CreateUserDto): Promise<LoginResponseDto> {
    const { email, name, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ email });
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.CONFLICT);
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user (assume usersRepository.save handles saving the user)
    const user = await this.usersRepository.create({
      email,
      name,
      hashedPassword,
    });

    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    return new LoginResponseDto({ accessToken, refreshToken, user });
  }

  async refresh(
    accessTokenRequestBodyDto: AccessTokenRequestBodyDto,
  ): Promise<LoginResponseDto> {
    const { refreshToken } = accessTokenRequestBodyDto;

    let tokenPayload;
    try {
      // Verify the refresh token's signature and decode its payload
      tokenPayload = this.jwtService.verify(refreshToken);
    } catch {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    const { id: userId, tokenId } = tokenPayload;

    // Check if the refresh token exists in the database
    const storedToken = await this.refreshTokensRepository.findOne({
      tokenId,
      userId,
    });
    if (!storedToken) {
      throw new HttpException(
        'Refresh token not found or has been revoked',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Optionally, ensure the token is not expired
    if (storedToken.expiresAt < new Date()) {
      throw new HttpException(
        'Refresh token has expired',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Fetch the user to validate existence
    const user = await this.usersRepository.findOne({ _id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    // Generate a new access token
    const accessToken = await this.createAccessToken(user);

    // Generate a new refresh token, which will also delete the old one
    const newRefreshToken = await this.createRefreshToken(user, refreshToken);

    return new LoginResponseDto({
      accessToken,
      refreshToken: newRefreshToken,
      user,
    });
  }

  private async createAccessToken(user: UserEntity) {
    return this.jwtService.sign(
      {
        id: user._id,
        email: user.email,
      },
      { expiresIn: '1d' },
    );
  }

  private async createRefreshToken(
    user: UserEntity,
    oldRefreshToken?: string,
  ): Promise<string> {
    // Generate a unique token ID
    const refreshTokenId = new mongoose.Types.ObjectId();

    // Generate the refresh token payload with the unique tokenId
    const refreshToken = this.jwtService.sign(
      {
        id: user._id.toString(), // User ID
        email: user.email, // User email
        tokenId: refreshTokenId, // Unique token identifier
      },
      { expiresIn: '7d' }, // Token valid for 7 days
    );

    // Hash the new refresh token for secure storage
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // If an old refresh token is provided, delete it using its tokenId
    if (oldRefreshToken) {
      const { tokenId } = this.jwtService.verify(oldRefreshToken);
      await this.refreshTokensRepository.deleteMany({
        tokenId,
        userId: user._id,
      });
    }

    // Save the new refresh token in the database
    await this.refreshTokensRepository.create({
      hashedRefreshToken,
      tokenId: refreshTokenId,
      userId: user._id, // User ID as ObjectId
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expiration in 7 days
    });

    return refreshToken; // Return the plain token to the client
  }
}
