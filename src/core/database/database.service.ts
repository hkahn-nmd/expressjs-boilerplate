import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  private readonly env: string;
  private readonly database: string;
  private readonly host: string;
  private readonly port: number;
  private readonly user: string;
  private readonly password: string;
  private readonly options: string;

  constructor(private readonly configService: ConfigService) {
    this.env = this.configService.get<string>('app.env');
    this.database = this.configService.get<string>('database.database');
    this.host = this.configService.get<string>('database.host');
    this.port = this.configService.get<number>('database.port');
    this.user = this.configService.get<string>('database.user');
    this.password = this.configService.get<string>('database.password');
    this.options = this.configService.get<string>('database.options');
  }

  createMongooseOptions() {
    let authenticationInfo = '';
    if (this.user && this.password) {
      authenticationInfo = `${encodeURIComponent(this.user)}:${encodeURIComponent(this.password)}@`;
    }

    // Prepare the base connection string
    const protocol =
      this.env === 'development' ? 'mongodb://' : 'mongodb+srv://';
    const portSegment = this.env === 'development' ? `:${this.port}` : '';
    const baseUri = `${protocol}${authenticationInfo}${this.host}${portSegment}/${this.database}`;

    // Append options if present
    const optionsSegment = this.options ? `?${this.options}` : '';

    // Full URI
    const uri = `${baseUri}${optionsSegment}`;

    return {
      uri,
      serverSelectionTimeoutMS: 5000,
    };
  }
}
