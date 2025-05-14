import { SECRET_KEY } from "@/env";
import { AdminRepository } from "@/repositories/AdminRepository";
import createError from "@fastify/error";
import bcrypt from "bcrypt";
import { createSigner, createVerifier } from "fast-jwt";
import { PrismaTransactionService } from "./PrismaTransactionService";
import { Admin } from "@prisma/client";

const AdminNotFoundError = createError('FST_ERR_NOT_FOUND', 'Không tìm thấy tài khoản quản trị viên với email %s', 404);
const InvalidPasswordError = createError('FST_ERR_AUTH', 'Sai mật khẩu', 401);
const UnauthorizedError = createError('FST_ERR_UNAUTHORIZED', 'Bạn chưa đăng nhập', 401);

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

    private async verifyTokenInternal(token: string): Promise<{ id: number }> {
        let res;
        try {
            res = await verify(token);
        } catch (error) {
            throw new UnauthorizedError("invalid token");
        }

        if (!res || !res.id || typeof res.id !== 'number') {
            throw new UnauthorizedError("invalid token");
        }
        return {
            id: res.id,
        };
    }

    async verifyToken(token: string): Promise<Admin> {
        const { id: adminId } = await this.verifyTokenInternal(token);

        const admin = await this.adminRepository.findById(adminId);
        if (!admin) {
            throw new AdminNotFoundError(adminId.toString());
        }
        return admin;
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
