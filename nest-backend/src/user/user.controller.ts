import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const existingUser = await this.userService.findUserByUsername(username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
    const user = await this.userService.createUser(username, password);
    const token = await this.userService.generateToken(user);
    return { token };
  }

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
  ): Promise<{ token: string }> {
    const { username, password } = body;
    const user = await this.userService.validateUser({ username, sub: '' });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // 验证密码，如果密码匹配，则生成 JWT 令牌并返回给客户端
    if (await this.userService.validatePassword(user, password)) {
      const token = await this.userService.generateToken(user);
      return { token };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @Post('check')
  async checkToken(@Body('token') token: string) {
    // 调用 AuthService 中的方法来验证令牌
    const userData = await this.userService.validateToken(token);
    return { user: userData };
  }
}
