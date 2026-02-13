// create a user service
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/app/entities/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
) {}

  async createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async getUserByEmail(email: string): Promise<User | null> {
   return await this.userRepository.findOne({ where: { email } });
  }
}   