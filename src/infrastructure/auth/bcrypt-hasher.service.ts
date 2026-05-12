import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { HasherPort } from '../../application/ports/hasher.port';

@Injectable()
export class BcryptHasherService implements HasherPort {
  private readonly saltRounds = 10;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
