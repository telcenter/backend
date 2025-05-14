import { CustomerServiceChatMessage } from "@prisma/client";
import { BaseRepositoryInterface, EntityCreatePayload, EntityUpdatePayload } from "./BaseRepositoryInterface";
import { PrismaClientLike } from "./PrismaClientLike";

export class CustomerServiceChatMessageRepository
    implements BaseRepositoryInterface<number, CustomerServiceChatMessage>
{
    constructor(private readonly prisma: PrismaClientLike) {}

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

    async findAllByChatId(chatId: number): Promise<CustomerServiceChatMessage[]> {
        return this.prisma.customerServiceChatMessage.findMany({ where: { chat_id: chatId } });
    }
}
