import { AdminController } from "@/controllers/AdminController";
import { AccountPackageRepository } from "@/repositories/AccountPackageRepository";
import { AccountRepository } from "@/repositories/AccountRepository";
import { AdminRepository } from "@/repositories/AdminRepository";
import { BalanceChangeRepository } from "@/repositories/BalanceChangeRepository";
import { CustomerServiceChatMessageRepository } from "@/repositories/CustomerServiceChatMessageRepository";
import { CustomerServiceChatRepository } from "@/repositories/CustomerServiceChatRepository";
import { FaqRepository } from "@/repositories/FaqRepository";
import { PackageMetadataInterpretationRepository } from "@/repositories/PackageMetadataInterpretationRepository";
import { PackageRepository } from "@/repositories/PackageRepository";
import { UserRepository } from "@/repositories/UserRepository";
import { AdminAuthService } from "@/services/AdminAuthService";
import { PrismaTransactionService } from "@/services/PrismaTransactionService";
import { Admin, PrismaClient/*, User*/ } from "@prisma/client";

// https://github.com/fastify/fastify/issues/1417#issuecomment-458601746

declare module 'fastify' {
    export interface FastifyInstance<
        HttpServer = Server,
        HttpRequest = IncomingMessage,
        HttpResponse = ServerResponse,
    > {
        prisma: PrismaClient;
        repositories: {
            accountPackageRepository: AccountPackageRepository;
            accountRepository: AccountRepository;
            adminRepository: AdminRepository;
            balanceChangeRepository: BalanceChangeRepository;
            customerServiceChatRepository: CustomerServiceChatRepository;
            customerServiceChatMessageRepository: CustomerServiceChatMessageRepository;
            faqRepository: FaqRepository;
            packageMetadataInterpretationRepository: PackageMetadataInterpretationRepository;
            packageRepository: PackageRepository;
            userRepository: UserRepository;
        };
        services: {
            adminAuthService: AdminAuthService;
            prismaTransactionService: PrismaTransactionService;
        }
        controllers: {
            adminController: AdminController;
        }
    }

    export interface FastifyRequest {
        admin: Admin;
    }
}
