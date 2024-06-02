// user.service.ts

import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    const user = new User();
    user.username = username;
    user.password = password;
    return this.userRepository.save(user);
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async generateToken(user: User): Promise<string> {
    const payload = { username: user.username, sub: user.id };
    return jwt.sign(payload, 'secret_key', { expiresIn: '128h' }); // 生成 JWT 令牌，设置过期时间
  }

  async validateUser(payload: {
    username: string;
    sub: string;
  }): Promise<User | null> {
    return this.findUserByUsername(payload.username);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async validateToken(token: string) {
    try {
      // 解析令牌，验证签名并获取用户信息
      const decodedToken: any = jwt.verify(token, 'secret_key');
      // 令牌是否过期
      if (new Date().getTime() >= decodedToken.exp * 1000) {
        return {
          username: '',
        };
      }
      // 根据令牌中的用户标识查询数据库，获取用户信息
      const user = await this.findUserByUsername(decodedToken.username);
      return {
        username: user.username,
      }; // 返回用户信息
    } catch (error) {
      // 令牌验证失败，返回空值或错误信息
      return {
        username: '',
      };
    }
  }
}
