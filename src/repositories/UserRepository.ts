import { User } from "@prisma/client";
import { BaseRepositoryInterface, EntityCreatePayload, EntityUpdatePayload } from "./BaseRepositoryInterface";
import { PrismaClientLike } from "./PrismaClientLike";

export class UserRepository implements BaseRepositoryInterface<number, User> {
    constructor(private readonly prisma: PrismaClientLike) {}

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany();
    }

    async findById(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async create(item: EntityCreatePayload<User>): Promise<User> {
        return this.prisma.user.create({ data: item });
    }

    async update(id: number, item: EntityUpdatePayload<User>): Promise<User | null> {
        return this.prisma.user.update({ where: { id }, data: item });
    }

    async delete(id: number): Promise<boolean> {
        await this.prisma.user.delete({ where: { id } });
        return true;
    }
}
