import { DrizzleClient, partners } from '@database';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import jwt, { JwtPayload } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { RegisterDto } from '.';
import { BadRequestException, NotFoundException } from '@exceptions';

export interface IAuthService {
  register(data: RegisterDto): Promise<string>;
  login(telegramId: number, password: string): Promise<string>;
}

export class AuthService implements IAuthService {
  private saltRounds = 10;
  private secretKey = process.env.SECRET_KEY;

  constructor(private db: DrizzleClient) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(password, salt);
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private generateJwt(payload: JwtPayload, expiresIn: StringValue = '24h') {
    if (!this.secretKey) {
      throw new NotFoundException('Secret key is not defined');
    }
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  public async register({ password, ...data }: RegisterDto) {
    const hash = await this.hashPassword(password);
    const partner = await this.db
      .insert(partners)
      .values({ hash, ...data })
      .returning({ telegramId: partners.telegramId });
    return this.generateJwt({ telegramId: partner[0].telegramId });
  }

  public async login(telegramId: number, password: string) {
    const partner = await this.db.query.partners.findFirst({
      where: eq(partners.telegramId, telegramId),
    });

    if (!partner) {
      throw new NotFoundException('Not found!');
    }

    const isValidPass = await this.comparePassword(password, partner.hash);

    if (!isValidPass) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateJwt({ telegramId: partner.telegramId });
  }
}
