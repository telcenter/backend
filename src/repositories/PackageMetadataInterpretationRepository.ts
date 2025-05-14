import { PackageMetadataInterpretation } from "@prisma/client";
import { BaseRepositoryInterface, EntityCreatePayload, EntityUpdatePayload } from "./BaseRepositoryInterface";
import { PrismaClientLike } from "./PrismaClientLike";

export class PackageMetadataInterpretationRepository
    implements BaseRepositoryInterface<number, PackageMetadataInterpretation>
{
    constructor(private readonly prisma: PrismaClientLike) {}

    async findAll(): Promise<PackageMetadataInterpretation[]> {
        return this.prisma.packageMetadataInterpretation.findMany();
    }

    async findById(id: number): Promise<PackageMetadataInterpretation | null> {
        return this.prisma.packageMetadataInterpretation.findUnique({ where: { id } });
    }

    async create(item: EntityCreatePayload<PackageMetadataInterpretation>)
    : Promise<PackageMetadataInterpretation> {
        return this.prisma.packageMetadataInterpretation.create({ data: item });
    }

    async update(
        id: number,
        item: EntityUpdatePayload<PackageMetadataInterpretation>
    ): Promise<PackageMetadataInterpretation | null> {
        return this.prisma.packageMetadataInterpretation.update({ where: { id }, data: item });
    }

    async delete(id: number): Promise<boolean> {
        await this.prisma.packageMetadataInterpretation.delete({ where: { id } });
        return true;
    }
}
