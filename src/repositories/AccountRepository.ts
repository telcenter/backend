import { Account, PrismaClient } from "@prisma/client";
import { BaseRepositoryInterface, EntityCreatePayload, EntityUpdatePayload } from "./BaseRepositoryInterface";

export class AccountRepository implements BaseRepositoryInterface<number, Account> {
    constructor(private readonly prisma: PrismaClient) {}

    async findAll(): Promise<Account[]> {
        return this.prisma.account.findMany();
    }

    async findById(id: number): Promise<Account | null> {
        return this.prisma.account.findUnique({ where: { id } });
    }

    async create(item: EntityCreatePayload<Account>): Promise<Account> {
        return this.prisma.account.create({ data: item });
    }

    async update(id: number, item: EntityUpdatePayload<Account>): Promise<Account | null> {
        return this.prisma.account.update({ where: { id }, data: item });
    }

    async delete(id: number): Promise<boolean> {
        await this.prisma.account.delete({ where: { id } });
        return true;
    }
}