import { PrismaClient } from "@prisma/client";
import { PrismaClientLike } from "../repositories/PrismaClientLike";

export class PrismaTransactionService {
    constructor(private readonly prisma: PrismaClient) {}

    async run<T>(callback: (prisma: PrismaClientLike) => Promise<T>): Promise<T> {
        return this.prisma.$transaction(callback);
    }
}
