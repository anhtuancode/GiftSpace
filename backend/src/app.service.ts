import { Injectable } from '@nestjs/common';
import { PrismaService } from './core/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealthCheck() {
    const totalUsers = await this.prisma.user.count();
    return {
      status: 'ok',
      service: 'GiftSpace Backend API',
      database: 'connected (MySQL Docker)',
      userCount: totalUsers,
      timestamp: new Date().toISOString(),
    };
  }
}
