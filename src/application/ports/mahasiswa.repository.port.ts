import { MahasiswaEntity } from '../../domain/mahasiswa/entities/mahasiswa.entity';

export interface CreateMahasiswaData {
  nim: string;
  namaMahasiswa: string;
  prodi: string;
  angkatan: number;
  dosenPaId: number;
}

export interface UpdateMahasiswaData {
  nim?: string;
  namaMahasiswa?: string;
  prodi?: string;
  angkatan?: number;
  dosenPaId?: number;
}

export interface MahasiswaWithDosenPa extends MahasiswaEntity {
  dosenPa: {
    id: number;
    nidn: string;
    namaDosen: string;
    email: string;
    noHp?: string | null;
  };
}

export interface MahasiswaRepositoryPort {
  findAll(): Promise<MahasiswaWithDosenPa[]>;
  findById(id: number): Promise<MahasiswaEntity | null>;
  findByNim(nim: string): Promise<MahasiswaEntity | null>;
  create(data: CreateMahasiswaData): Promise<MahasiswaEntity>;
  update(id: number, data: UpdateMahasiswaData): Promise<MahasiswaEntity>;
  delete(id: number): Promise<void>;
  findByDosenPaId(dosenId: number): Promise<MahasiswaEntity[]>;
  findAllWithDosenPa(): Promise<MahasiswaWithDosenPa[]>;
  findDetailWithDosenPa(id: number): Promise<MahasiswaWithDosenPa | null>;
}
