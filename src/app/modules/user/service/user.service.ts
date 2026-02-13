import { Injectable } from '@nestjs/common';
import { UserRepository } from '../respository/user.repository';
import { Role, User } from 'src/app/entities/user/user.entity';
import { SignupRequestDto } from 'src/app/auth/dto/request/signup.request.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async createUser(user: SignupRequestDto): Promise<User> {
    const newUser = new User();
    newUser.fullName = user.fullName;
    newUser.email = user.email;
    newUser.passwordHash = user.password;
    return this.userRepository.createUser(newUser);
  }
  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.getUserByEmail(email);
  }
}
