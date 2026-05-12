export class DosenEntity {
  id: number;
  nidn: string;
  namaDosen: string;
  email: string;
  noHp?: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: number;
    nidn: string;
    namaDosen: string;
    email: string;
    noHp?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.nidn = props.nidn;
    this.namaDosen = props.namaDosen;
    this.email = props.email;
    this.noHp = props.noHp ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
