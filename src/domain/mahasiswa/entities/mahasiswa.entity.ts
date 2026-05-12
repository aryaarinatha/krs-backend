export class MahasiswaEntity {
  id: number;
  nim: string;
  namaMahasiswa: string;
  prodi: string;
  angkatan: number;
  dosenPaId: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: number;
    nim: string;
    namaMahasiswa: string;
    prodi: string;
    angkatan: number;
    dosenPaId: number;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.nim = props.nim;
    this.namaMahasiswa = props.namaMahasiswa;
    this.prodi = props.prodi;
    this.angkatan = props.angkatan;
    this.dosenPaId = props.dosenPaId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
