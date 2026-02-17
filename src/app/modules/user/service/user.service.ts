import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../respository/user.repository';
import { Role, User } from '../../../entities/user/user.entity';

export interface CreateUserInput {
  fullName: string;
  email: string;
  passwordHash: string;
}

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(input: CreateUserInput): Promise<User> {
    const newUser = new User();
    newUser.fullName = input.fullName;
    newUser.email = input.email;
    newUser.passwordHash = input.passwordHash;
    return this.userRepository.createUser(newUser);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.getUserByEmail(email);
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async updateRole(userId: number, role: Role): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = role;
    return this.userRepository.save(user);
  }
}
