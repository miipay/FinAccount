import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
    console.log(`req: ${req.originalUrl}, method: ${req.method}, res: ${res.statusCode}`);
  }
}
