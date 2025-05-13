import { Faq, PrismaClient } from "@prisma/client";
import { BaseRepositoryInterface, EntityCreatePayload, EntityUpdatePayload } from "./BaseRepositoryInterface";

export class FaqRepository implements BaseRepositoryInterface<number, Faq> {
    constructor(private readonly prisma: PrismaClient) {}

    async findAll(): Promise<Faq[]> {
        return this.prisma.faq.findMany();
    }

    async findById(id: number): Promise<Faq | null> {
        return this.prisma.faq.findUnique({ where: { id } });
    }

    async create(item: EntityCreatePayload<Faq>): Promise<Faq> {
        return this.prisma.faq.create({ data: item });
    }

    async update(id: number, item: EntityUpdatePayload<Faq>): Promise<Faq | null> {
        return this.prisma.faq.update({ where: { id }, data: item });
    }

    async delete(id: number): Promise<boolean> {
        await this.prisma.faq.delete({ where: { id } });
        return true;
    }
}
