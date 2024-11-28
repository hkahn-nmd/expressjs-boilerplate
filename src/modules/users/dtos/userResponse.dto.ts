export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: any) {
    this.id = user._id;
    this.email = user.email;
    this.name = user.name;
  }
}
