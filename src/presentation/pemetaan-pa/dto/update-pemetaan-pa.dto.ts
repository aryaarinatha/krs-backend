import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class UpdatePemetaanPaDto {
  @Type(() => Number)
  @IsInt({ message: 'Dosen PA harus berupa id integer' })
  @Min(1, { message: 'Dosen PA wajib dipilih' })
  dosenPaId: number;
}
