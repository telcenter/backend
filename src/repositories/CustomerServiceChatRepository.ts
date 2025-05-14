import { CustomerServiceChat } from "@prisma/client";
import { BaseRepositoryInterface, EntityCreatePayload, EntityUpdatePayload } from "./BaseRepositoryInterface";
import { PrismaClientLike } from "./PrismaClientLike";

export class CustomerServiceChatRepository
    implements BaseRepositoryInterface<number, CustomerServiceChat>
{
    constructor(private readonly prisma: PrismaClientLike) {}

    async findAll(): Promise<CustomerServiceChat[]> {
        return this.prisma.customerServiceChat.findMany();
    }

    async findById(id: number): Promise<CustomerServiceChat | null> {
        return this.prisma.customerServiceChat.findUnique({ where: { id } });
    }

    async create(item: EntityCreatePayload<CustomerServiceChat>): Promise<CustomerServiceChat> {
        return this.prisma.customerServiceChat.create({ data: item });
    }

    async update(id: number, item: EntityUpdatePayload<CustomerServiceChat>): Promise<CustomerServiceChat | null> {
        return this.prisma.customerServiceChat.update({ where: { id }, data: item });
    }

    async delete(id: number): Promise<boolean> {
        await this.prisma.customerServiceChat.delete({ where: { id } });
        return true;
    }
}
