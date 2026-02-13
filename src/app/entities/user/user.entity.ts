
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum Role {
  ADMIN = 'admin',
  VIP = 'vip',
  NORMAL = 'normal',
  GUEST = 'guest',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  passwordHash : string;

  @Column({ type: 'enum', enum: Role, default: Role.NORMAL })
  role: Role;

  @Column()
  createdAt: Date;
  
}