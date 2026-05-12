import { DosenEntity } from '../../domain/dosen/entities/dosen.entity';

export interface CreateDosenData {
  nidn: string;
  namaDosen: string;
  email: string;
  noHp?: string | null;
}

export interface UpdateDosenData {
  nidn?: string;
  namaDosen?: string;
  email?: string;
  noHp?: string | null;
}

export interface DosenWithBimbingan extends DosenEntity {
  mahasiswaBimbingan: Array<{
    id: number;
    nim: string;
    namaMahasiswa: string;
    prodi: string;
    angkatan: number;
  }>;
}

export interface DosenListItem extends DosenEntity {
  jumlahMahasiswaBimbingan: number;
}

export interface DosenRepositoryPort {
  findAll(): Promise<DosenListItem[]>;
  findById(id: number): Promise<DosenEntity | null>;
  findByNidn(nidn: string): Promise<DosenEntity | null>;
  findByEmail(email: string): Promise<DosenEntity | null>;
  create(data: CreateDosenData): Promise<DosenEntity>;
  update(id: number, data: UpdateDosenData): Promise<DosenEntity>;
  delete(id: number): Promise<void>;
  countMahasiswaBimbingan(dosenId: number): Promise<number>;
  findWithMahasiswaBimbingan(id: number): Promise<DosenWithBimbingan | null>;
  findAllWithMahasiswaBimbingan(): Promise<DosenWithBimbingan[]>;
}
