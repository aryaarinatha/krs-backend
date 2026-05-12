import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Username harus berupa string' })
  @IsNotEmpty({ message: 'Username wajib diisi' })
  @MaxLength(50)
  username: string;

  @IsString({ message: 'Password harus berupa string' })
  @IsNotEmpty({ message: 'Password wajib diisi' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  @MaxLength(100)
  password: string;
}
