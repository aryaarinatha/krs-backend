import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateDosenDto {
  @IsOptional()
  @IsString({ message: 'NIDN harus berupa string' })
  @MaxLength(30)
  nidn?: string;

  @IsOptional()
  @IsString({ message: 'Nama dosen harus berupa string' })
  @MaxLength(150)
  namaDosen?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email tidak valid' })
  @MaxLength(150)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  noHp?: string;
}
