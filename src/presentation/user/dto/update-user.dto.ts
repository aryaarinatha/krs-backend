import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../../../common/enums/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Username harus berupa string' })
  @MaxLength(50)
  username?: string;

  @IsOptional()
  @IsString({ message: 'Password harus berupa string' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  @MaxLength(100)
  password?: string;

  @IsOptional()
  @IsString({ message: 'Nama lengkap harus berupa string' })
  @MaxLength(150)
  namaLengkap?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role tidak valid' })
  role?: Role;
}
