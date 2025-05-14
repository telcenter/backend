import { AdminRepository } from "@/repositories/AdminRepository";
import { CustomerServiceChatRepository } from "@/repositories/CustomerServiceChatRepository";
import { FaqRepository } from "@/repositories/FaqRepository";
import { PackageMetadataInterpretationRepository } from "@/repositories/PackageMetadataInterpretationRepository";
import { PackageRepository } from "@/repositories/PackageRepository";
import { UserRepository } from "@/repositories/UserRepository";
import { TAdminCreateRequestBody } from "@/schemas/AdminCreateRequestBody";
import { TAdminDeleteRequestBody } from "@/schemas/AdminDeleteRequestBody";
import { TAdminLoginRequestBody } from "@/schemas/AdminLoginRequestBody";
import { TAdminLoginResponseBody } from "@/schemas/AdminLoginResponseBody";
import { TAdminSchema } from "@/schemas/AdminSchema";
import { TAdminUpdatePasswordRequestBody } from "@/schemas/AdminUpdatePasswordRequestBody";
import { TFaqCreateRequestBody } from "@/schemas/FaqCreateRequestBody";
import { TFaqCreateResponseBody } from "@/schemas/FaqCreateResponseBody";
import { convertToFaqSchema, convertToFaqSchemaList, TFaqSchema } from "@/schemas/FaqSchema";
import { TPackageCreateRequestBody } from "@/schemas/PackageCreateRequestBody";
import { TPackageMetadataInterpretationCreateRequestBody } from "@/schemas/PackageMetadataInterpretationCreateRequestBody";
import { convertToPackageMetadataInterpretationSchema, convertToPackageMetadataInterpretationSchemaList, TPackageMetadataInterpretationSchema, TPackageMetadataInterpretationSchemaList } from "@/schemas/PackageMetadataInterpretationSchema";
import { convertToPackageSchema, convertToPackageSchemaList, TPackageSchema, TPackageSchemaList } from "@/schemas/PackageSchema";
import { TUserCreateRequestBody } from "@/schemas/UserCreateRequestBody";
import { convertToUserSchema, TUserSchema } from "@/schemas/UserSchema";
import { TUserUpdateRequestBody } from "@/schemas/UserUpdateRequestBody";
import { AdminAuthService } from "@/services/AdminAuthService";
import createError from "@fastify/error";

const WrongSecretKeyError = createError('FST_ERR_AUTH', "Bạn đã nhập sai mã bí mật. Vui lòng kiểm tra và nhập lại.", 401);

export class AdminController {
    constructor(
        private readonly adminRepository: AdminRepository,
        private readonly userRepository: UserRepository,
        private readonly customerServiceChatRepository: CustomerServiceChatRepository,
        private readonly packageMetadataInterpretationRepository: PackageMetadataInterpretationRepository,
        private readonly packageRepository: PackageRepository,
        private readonly adminAuthService: AdminAuthService,
        private readonly faqRepository: FaqRepository,
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

    // async getCustomerServiceChats() {
    //     return this.customerServiceChatRepository.findAll();
    // }

    // async getPackageMetadataInterpretations() {
    //     return this.packageMetadataInterpretationRepository.findAll();
    // }

    async getFaqs(): Promise<TFaqSchema[]> {
        return this.faqRepository.findAll().then(convertToFaqSchemaList);
    }

    async createFaq(adminId: number, payload: TFaqCreateRequestBody): Promise<TFaqCreateResponseBody> {
        return this.faqRepository.create({
            question: payload.question,
            answer: payload.answer,
            created_by_admin_id: adminId,
        }).then(convertToFaqSchema);
    }

    async deleteFaq(id: number): Promise<{ success: boolean }> {
        return {
            success: await this.faqRepository.delete(id),
        };
    }

    async getPackages(): Promise<TPackageSchemaList> {
        return this.packageRepository.findAll().then(convertToPackageSchemaList);
    }

    async createPackage(adminId: number, payload: TPackageCreateRequestBody): Promise<TPackageSchema> {
        return this.packageRepository.create({
            name: payload.name,
            metadata: payload.metadata,
            created_by_admin_id: adminId,
        }).then(convertToPackageSchema);
    }

    async deletePackage(id: number): Promise<{ success: boolean }> {
        return {
            success: await this.packageRepository.delete(id),
        };
    }

    async getPackageMetadataInterpretations(): Promise<TPackageMetadataInterpretationSchemaList> {
        return this.packageMetadataInterpretationRepository.findAll()
            .then(convertToPackageMetadataInterpretationSchemaList);
    }

    async createPackageMetadataInterpretation(
        adminId: number,
        payload: TPackageMetadataInterpretationCreateRequestBody,
    ): Promise<TPackageMetadataInterpretationSchema> {
        return this.packageMetadataInterpretationRepository.create({
            field_name: payload.field_name,
            field_local_name: payload.field_local_name,
            field_interpretation: payload.field_interpretation,
            created_by_admin_id: adminId,
        }).then(convertToPackageMetadataInterpretationSchema);
    }

    async deletePackageMetadataInterpretation(
        id: number,
    ): Promise<{ success: boolean }> {
        return {
            success: await this.packageMetadataInterpretationRepository.delete(id),
        };
    }
}
