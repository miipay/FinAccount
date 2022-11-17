import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from '../src/shared/interfaces';

export const createFakeJWT = (jwtService: JwtService, payload: JWTPayload) => {
  return jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET });
};
