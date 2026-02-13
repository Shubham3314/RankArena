import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './app/entities/user/user.entity';
import { UserModule } from './app/modules/user/user.module';
import { AuthModule } from './app/auth/auth.module';


@Module({
  imports: [ 
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'rank_arena',
    entities: [User],
    synchronize: true,
  }), UserModule, AuthModule
],
  controllers: [],
  providers: [],
})
export class AppModule {}
