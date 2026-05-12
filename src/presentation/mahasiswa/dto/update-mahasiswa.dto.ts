import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateMahasiswaDto {
  @IsOptional()
  @IsString({ message: 'NIM harus berupa string' })
  @MaxLength(20)
  nim?: string;

  @IsOptional()
  @IsString({ message: 'Nama mahasiswa harus berupa string' })
  @MaxLength(150)
  namaMahasiswa?: string;

  @IsOptional()
  @IsString({ message: 'Prodi harus berupa string' })
  @MaxLength(100)
  prodi?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Angkatan harus berupa integer' })
  @Min(1900, { message: 'Angkatan tidak valid' })
  angkatan?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Dosen PA harus berupa id integer' })
  @Min(1, { message: 'Dosen PA tidak valid' })
  dosenPaId?: number;
}
