import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { AccountPackageRepository } from "./AccountPackageRepository";
import { AccountRepository } from "./AccountRepository";
import { AdminRepository } from "./AdminRepository";
import { BalanceChangeRepository } from "./BalanceChangeRepository";
import { CustomerServiceChatRepository } from "./CustomerServiceChatRepository";
import { CustomerServiceChatMessageRepository } from "./CustomerServiceChatMessageRepository";
import { FaqRepository } from "./FaqRepository";
import { PackageMetadataInterpretationRepository } from "./PackageMetadataInterpretationRepository";
import { PackageRepository } from "./PackageRepository";
import { UserRepository } from "./UserRepository";

export const registerRepositories = fastifyPlugin((server: FastifyInstance, options: FastifyPluginOptions) => {
    const repositories = {
        accountPackageRepository: new AccountPackageRepository(server.prisma),
        accountRepository: new AccountRepository(server.prisma),
        adminRepository: new AdminRepository(server.prisma),
        balanceChangeRepository: new BalanceChangeRepository(server.prisma),
        customerServiceChatRepository: new CustomerServiceChatRepository(server.prisma),
        customerServiceChatMessageRepository: new CustomerServiceChatMessageRepository(server.prisma),
        faqRepository: new FaqRepository(server.prisma),
        packageMetadataInterpretationRepository: new PackageMetadataInterpretationRepository(server.prisma),
        packageRepository: new PackageRepository(server.prisma),
        userRepository: new UserRepository(server.prisma),
    };

    server.decorate('repositories', repositories);
});
