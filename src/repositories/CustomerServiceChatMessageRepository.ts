import { CustomerServiceChatMessage, PrismaClient } from "@prisma/client";
import { BaseRepositoryInterface, EntityCreatePayload, EntityUpdatePayload } from "./BaseRepositoryInterface";

export class CustomerServiceChatMessageRepository
    implements BaseRepositoryInterface<number, CustomerServiceChatMessage>
{
    constructor(private readonly prisma: PrismaClient) {}

    async findAll(): Promise<CustomerServiceChatMessage[]> {
        return this.prisma.customerServiceChatMessage.findMany();
    }

    async findById(id: number): Promise<CustomerServiceChatMessage | null> {
        return this.prisma.customerServiceChatMessage.findUnique({ where: { id } });
    }

    async create(item: EntityCreatePayload<CustomerServiceChatMessage>): Promise<CustomerServiceChatMessage> {
        return this.prisma.customerServiceChatMessage.create({ data: item });
    }

    async update(
        id: number,
        item: EntityUpdatePayload<CustomerServiceChatMessage>
    ): Promise<CustomerServiceChatMessage | null> {
        return this.prisma.customerServiceChatMessage.update({ where: { id }, data: item });
    }

    async delete(id: number): Promise<boolean> {
        await this.prisma.customerServiceChatMessage.delete({ where: { id } });
        return true;
    }
}
