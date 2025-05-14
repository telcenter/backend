import { Package } from "@prisma/client";
import { BaseRepositoryInterface, EntityCreatePayload, EntityUpdatePayload } from "./BaseRepositoryInterface";
import { PrismaClientLike } from "./PrismaClientLike";

export class PackageRepository implements BaseRepositoryInterface<number, Package> {
    constructor(private readonly prisma: PrismaClientLike) {}

    async findAll(): Promise<Package[]> {
        return this.prisma.package.findMany();
    }

    async findById(id: number): Promise<Package | null> {
        return this.prisma.package.findUnique({ where: { id } });
    }

    async create(item: EntityCreatePayload<Package>): Promise<Package> {
        return this.prisma.package.create({ data: item });
    }

    async update(id: number, item: EntityUpdatePayload<Package>): Promise<Package | null> {
        return this.prisma.package.update({ where: { id }, data: item });
    }

    async delete(id: number): Promise<boolean> {
        await this.prisma.package.delete({ where: { id } });
        return true;
    }
}
