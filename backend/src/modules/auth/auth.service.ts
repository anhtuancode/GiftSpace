import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Hàm phụ tạo cặp 2 token
  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: parseInt(this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '900'), 10),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '604800'), 10),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  // Cập nhật refresh token đã băm vào DB
  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateRefreshToken(userId, hash);
  }

  // 1. Đăng nhập
  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  // 2. Làm mới Token
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findByIdWithRefreshToken(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Quyền truy cập bị từ chối');
    }

    // So khớp refresh token gửi lên với hash lưu trong DB
    const isMatched = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatched) {
      throw new ForbiddenException('Quyền truy cập bị từ chối');
    }

    // Cấp cặp token mới và lưu lại hash mới (Token Rotation)
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  // 3. Đăng xuất (Thu hồi quyền)
  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, null);
    return { message: 'Đăng xuất thành công' };
  }
}