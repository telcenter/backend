import { Admin } from "@prisma/client";
import { BaseRepositoryInterface, EntityCreatePayload, EntityUpdatePayload } from "./BaseRepositoryInterface";
import { PrismaClientLike } from "./PrismaClientLike";

export class AdminRepository implements BaseRepositoryInterface<number, Admin> {
    constructor(private readonly prisma: PrismaClientLike) {}

    async findAll(): Promise<Admin[]> {
        return this.prisma.admin.findMany();
    }

    async findById(id: number): Promise<Admin | null> {
        return this.prisma.admin.findUnique({ where: { id } });
    }

    async create(item: EntityCreatePayload<Admin>): Promise<Admin> {
        return this.prisma.admin.create({ data: item });
    }

    async update(id: number, item: EntityUpdatePayload<Admin>): Promise<Admin | null> {
        return this.prisma.admin.update({ where: { id }, data: item });
    }

    async delete(id: number): Promise<boolean> {
        await this.prisma.admin.delete({ where: { id } });
        return true;
    }

    async findByEmail(email: string): Promise<Admin | null> {
        return this.prisma.admin.findUnique({
            where: { email },
        });
    }

    async updateByEmail(email: string, item: EntityUpdatePayload<Admin>): Promise<Admin | null> {
        return this.prisma.admin.update({
            where: { email },
            data: item,
        });
    }
};
