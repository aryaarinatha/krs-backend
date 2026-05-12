import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDosenDto {
  @IsString({ message: 'NIDN harus berupa string' })
  @IsNotEmpty({ message: 'NIDN wajib diisi' })
  @MaxLength(30)
  nidn: string;

  @IsString({ message: 'Nama dosen harus berupa string' })
  @IsNotEmpty({ message: 'Nama dosen wajib diisi' })
  @MaxLength(150)
  namaDosen: string;

  @IsEmail({}, { message: 'Email tidak valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  @MaxLength(150)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  noHp?: string;
}
