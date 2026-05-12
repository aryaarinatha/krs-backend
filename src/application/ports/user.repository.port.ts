import { Role } from '../../common/enums/role.enum';
import { UserEntity } from '../../domain/user/entities/user.entity';

export interface CreateUserData {
  username: string;
  password: string;
  namaLengkap: string;
  role: Role;
}

export interface UpdateUserData {
  username?: string;
  password?: string;
  namaLengkap?: string;
  role?: Role;
}

export interface UserRepositoryPort {
  findAll(): Promise<UserEntity[]>;
  findById(id: number): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  create(data: CreateUserData): Promise<UserEntity>;
  update(id: number, data: UpdateUserData): Promise<UserEntity>;
  delete(id: number): Promise<void>;
}
