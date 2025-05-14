import { AdminRepository } from "@/repositories/AdminRepository";
import { CustomerServiceChatRepository } from "@/repositories/CustomerServiceChatRepository";
import { PackageMetadataInterpretationRepository } from "@/repositories/PackageMetadataInterpretationRepository";
import { UserRepository } from "@/repositories/UserRepository";
import { TAdminCreateRequestBody } from "@/schemas/AdminCreateRequestBody";
import { TAdminDeleteRequestBody } from "@/schemas/AdminDeleteRequestBody";
import { TAdminLoginRequestBody } from "@/schemas/AdminLoginRequestBody";
import { TAdminLoginResponseBody } from "@/schemas/AdminLoginResponseBody";
import { TAdminSchema } from "@/schemas/AdminSchema";
import { TAdminUpdatePasswordRequestBody } from "@/schemas/AdminUpdatePasswordRequestBody";
import { TUserCreateRequestBody } from "@/schemas/UserCreateRequestBody";
import { convertToUserSchema, TUserSchema, UserSchema } from "@/schemas/UserSchema";
import { TUserUpdateRequestBody } from "@/schemas/UserUpdateRequestBody";
import { AdminAuthService } from "@/services/AdminAuthService";
import createError from "@fastify/error";

const WrongSecretKeyError = createError('FST_ERR_AUTH', "Wrong secret key", 401);

export class AdminController {
    constructor(
        private readonly adminRepository: AdminRepository,
        private readonly userRepository: UserRepository,
        private readonly customerServiceChatRepository: CustomerServiceChatRepository,
        private readonly packageMetadataInterpretationRepository: PackageMetadataInterpretationRepository,
        private readonly adminAuthService: AdminAuthService,
    ) { }

    async login(payload: TAdminLoginRequestBody): Promise<TAdminLoginResponseBody> {
        return await this.adminAuthService.login({
            email: payload.email,
            password: payload.password,
        });
    }

    async getAdmins(): Promise<TAdminSchema[]> {
        return await this.adminRepository.findAll();
    }

    async createAdmin(payload: TAdminCreateRequestBody): Promise<TAdminSchema> {
        if (payload.secret_key !== 'admin') {
            throw new WrongSecretKeyError();
        }
        return await this.adminAuthService.createAdmin({
            email: payload.email,
            password: payload.password,
        });
    }

    async updateAdminPassword(payload: TAdminUpdatePasswordRequestBody): Promise<TAdminSchema> {
        return await this.adminAuthService.updateAdminPassword({
            email: payload.email,
            oldPassword: payload.old_password,
            newPassword: payload.new_password,
        });
    }

    async deleteAdmin(payload: TAdminDeleteRequestBody): Promise<{ success: boolean }> {
        return {
            success: await this.adminAuthService.deleteAdmin({
                email: payload.email,
                password: payload.password,
            }),
        };
    }

    async getUsers() {
        return this.userRepository.findAll();
    }

    async createUser(payload: TUserCreateRequestBody): Promise<TUserSchema> {
        return await this.userRepository.create({
            full_name: payload.full_name,
            national_id: payload.national_id,
            birth_date: new Date(payload.birth_date),
        }).then(convertToUserSchema);
    }

    async updateUser(id: number, payload: TUserUpdateRequestBody): Promise<TUserSchema> {
        const user = await this.userRepository.update(
            id, {
            full_name: payload.full_name,
            national_id: payload.national_id,
            birth_date: new Date(payload.birth_date),
        });

        if (!user) {
            throw new Error("User not found");
        }
        return convertToUserSchema(user);
    }

    async getCustomerServiceChats() {
        return this.customerServiceChatRepository.findAll();
    }

    async getPackageMetadataInterpretations() {
        return this.packageMetadataInterpretationRepository.findAll();
    }
}
