import { SECRET_KEY } from "@/env";
import { AdminRepository } from "@/repositories/AdminRepository";
import createError from "@fastify/error";
import bcrypt from "bcrypt";
import { createSigner, createVerifier } from "fast-jwt";
import { PrismaTransactionService } from "./PrismaTransactionService";

const AdminNotFoundError = createError('FST_ERR_NOT_FOUND', 'Admin not found by email %s', 404);
const InvalidPasswordError = createError('FST_ERR_AUTH', 'Invalid password', 401);
const UnauthorizedError = createError('FST_ERR_UNAUTHORIZED', 'Unauthorized', 401);

const JWT_SECRET = SECRET_KEY;
const sign = createSigner({
    key: JWT_SECRET,
    algorithm: 'HS256',
    expiresIn: '1h',
});
const verify = createVerifier({
    key: JWT_SECRET,
    algorithms: ['HS256'],
});

export class AdminAuthService {
    constructor(
        private readonly adminRepository: AdminRepository,
        private readonly prismaTransactionService: PrismaTransactionService,
    ) { }

    private async hashPassword(password: string): Promise<string> {
        const SALT_ROUNDS = 10;
        return await bcrypt.hash(password, SALT_ROUNDS);
    }

    private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }

    private async issueToken(adminId: number): Promise<string> {
        return sign({ id: adminId });
    }

    private async verifyToken(token: string): Promise<{ id: number }> {
        try {
            return await verify(token);
        } catch (error) {
            throw new UnauthorizedError("invalid token");
        }
    }

    async login({ email, password }: {
        email: string, password: string,
    }) {
        const admin = await this.adminRepository.findByEmail(email);

        if (!admin) {
            throw new AdminNotFoundError(email);
        }

        const isPasswordValid = await this.comparePassword(password, admin.password);
        if (!isPasswordValid) {
            throw new InvalidPasswordError();
        }

        const access_token = await this.issueToken(admin.id);

        return { access_token, admin };
    }

    async createAdmin({ email, password }: {
        email: string, password: string,
    }) {
        const hashedPassword = await this.hashPassword(password);
        return this.adminRepository.create({ email, password: hashedPassword });
    }

    async updateAdminPassword({ email, oldPassword, newPassword }: {
        email: string, oldPassword: string, newPassword: string,
    }) {
        return this.prismaTransactionService.run(async tx => {
            const adminRepository = new AdminRepository(tx);
            const hashedPassword = await this.hashPassword(newPassword);
            
            const admin = await adminRepository.findByEmail(email);
            if (!admin) {
                throw new AdminNotFoundError(email);
            }
            const isPasswordValid = await this.comparePassword(oldPassword, admin.password);
            if (!isPasswordValid) {
                throw new InvalidPasswordError();
            }
            const newAdmin = await adminRepository.updateByEmail(email, { password: hashedPassword });
            if (!newAdmin) {
                throw new AdminNotFoundError(email);
            }
            return newAdmin;
        });
    }

    async deleteAdmin({ email, password }: {
        email: string, password: string,
    }) {
        const admin = await this.adminRepository.findByEmail(email);

        if (!admin) {
            throw new AdminNotFoundError(email);
        }

        const isPasswordValid = await this.comparePassword(password, admin.password);
        if (!isPasswordValid) {
            throw new InvalidPasswordError();
        }

        return this.adminRepository.delete(admin.id);
    }
}
