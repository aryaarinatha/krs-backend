import { Role } from '../../../common/enums/role.enum';

export class UserEntity {
  id: number;
  username: string;
  password: string;
  namaLengkap: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: {
    id: number;
    username: string;
    password: string;
    namaLengkap: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.username = props.username;
    this.password = props.password;
    this.namaLengkap = props.namaLengkap;
    this.role = props.role;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
