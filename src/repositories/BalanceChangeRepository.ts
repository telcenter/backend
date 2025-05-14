import { BalanceChange } from "@prisma/client";
import { BaseRepositoryInterface, EntityCreatePayload, EntityUpdatePayload } from "./BaseRepositoryInterface";
import { PrismaClientLike } from "./PrismaClientLike";

export class BalanceChangeRepository implements BaseRepositoryInterface<number, BalanceChange> {
    constructor(private readonly prisma: PrismaClientLike) {}

    async findAll(): Promise<BalanceChange[]> {
        return this.prisma.balanceChange.findMany();
    }

    async findById(id: number): Promise<BalanceChange | null> {
        return this.prisma.balanceChange.findUnique({ where: { id } });
    }

    async create(item: EntityCreatePayload<BalanceChange>): Promise<BalanceChange> {
        return this.prisma.balanceChange.create({ data: item });
    }

    async update(id: number, item: EntityUpdatePayload<BalanceChange>): Promise<BalanceChange | null> {
        return this.prisma.balanceChange.update({ where: { id }, data: item });
    }

    async delete(id: number): Promise<boolean> {
        await this.prisma.balanceChange.delete({ where: { id } });
        return true;
    }
}
