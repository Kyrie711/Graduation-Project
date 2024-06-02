// cors.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*'); // 允许所有源
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    // 如果是 OPTIONS 请求，直接返回 200 状态码
    if (req.method === 'OPTIONS') {
      res.status(200).send();
      return;
    }
    next();
  }
}
