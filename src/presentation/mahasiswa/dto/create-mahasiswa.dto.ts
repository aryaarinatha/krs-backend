import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateMahasiswaDto {
  @IsString({ message: 'NIM harus berupa string' })
  @IsNotEmpty({ message: 'NIM wajib diisi' })
  @MaxLength(20)
  nim: string;

  @IsString({ message: 'Nama mahasiswa harus berupa string' })
  @IsNotEmpty({ message: 'Nama mahasiswa wajib diisi' })
  @MaxLength(150)
  namaMahasiswa: string;

  @IsString({ message: 'Prodi harus berupa string' })
  @IsNotEmpty({ message: 'Prodi wajib diisi' })
  @MaxLength(100)
  prodi: string;

  @Type(() => Number)
  @IsInt({ message: 'Angkatan harus berupa integer' })
  @Min(1900, { message: 'Angkatan tidak valid' })
  angkatan: number;

  @Type(() => Number)
  @IsInt({ message: 'Dosen PA harus berupa id integer' })
  @Min(1, { message: 'Dosen PA wajib dipilih' })
  dosenPaId: number;
}
