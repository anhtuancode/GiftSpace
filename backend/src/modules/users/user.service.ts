import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async create(CreateUserDto: CreateUserDto) {
        const { email, name, phone, password } = CreateUserDto
        // check email, phone existed
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone }
                ]
            }
        })
        if (existingUser) throw new ConflictException('Email or phone already exists')

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        return this.prisma.user.create({
            data: {
                email,
                name,
                phone,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        })
    }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new NotFoundException(`Không tìm thấy người dùng với ID: ${id}`);
        }
        return user;
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    // Cập nhật refreshToken (đã hash) vào DB
    async updateRefreshToken(userId: string, refreshToken: string | null) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken },
        });
    }

    // Tìm user theo id lấy kèm cả refreshToken để đối chiếu
    async findByIdWithRefreshToken(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                refreshToken: true,
            },
        });
    }


}