import 'express-session';
import { Role } from '../enums/role.enum';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      role: Role;
      namaLengkap: string;
    };
  }
}
