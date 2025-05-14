import { AccountRepository } from "@/repositories/AccountRepository";
import { AdminRepository } from "@/repositories/AdminRepository";
import { CustomerServiceChatMessageRepository } from "@/repositories/CustomerServiceChatMessageRepository";
import { CustomerServiceChatRepository } from "@/repositories/CustomerServiceChatRepository";
import { FaqRepository } from "@/repositories/FaqRepository";
import { PackageMetadataInterpretationRepository } from "@/repositories/PackageMetadataInterpretationRepository";
import { PackageRepository } from "@/repositories/PackageRepository";
import { TAccountBalanceUpdateRequestBody } from "@/schemas/AccountBalanceUpdateRequestBody";
import { TAccountCreateRequestBody } from "@/schemas/AccountCreateRequestBody";
import { convertToAccountSchema, convertToAccountSchemaList, TAccountSchema, TAccountSchemaList } from "@/schemas/AccountSchema";
import { TAdminCreateRequestBody } from "@/schemas/AdminCreateRequestBody";
import { TAdminDeleteRequestBody } from "@/schemas/AdminDeleteRequestBody";
import { TAdminLoginRequestBody } from "@/schemas/AdminLoginRequestBody";
import { TAdminLoginResponseBody } from "@/schemas/AdminLoginResponseBody";
import { TAdminSchema } from "@/schemas/AdminSchema";
import { TAdminUpdatePasswordRequestBody } from "@/schemas/AdminUpdatePasswordRequestBody";
import { convertToCustomerServiceChatMessageSchemaList, TCustomerServiceChatMessageSchemaList } from "@/schemas/CustomerServiceChatMessageSchema";
import { convertToCustomerServiceChatSchemaList, TCustomerServiceChatSchemaList } from "@/schemas/CustomerServiceChatSchema";
import { TFaqCreateRequestBody } from "@/schemas/FaqCreateRequestBody";
import { TFaqCreateResponseBody } from "@/schemas/FaqCreateResponseBody";
import { convertToFaqSchema, convertToFaqSchemaList, TFaqSchema } from "@/schemas/FaqSchema";
import { TPackageCreateRequestBody } from "@/schemas/PackageCreateRequestBody";
import { TPackageMetadataInterpretationCreateRequestBody } from "@/schemas/PackageMetadataInterpretationCreateRequestBody";
import { convertToPackageMetadataInterpretationSchema, convertToPackageMetadataInterpretationSchemaList, TPackageMetadataInterpretationSchema, TPackageMetadataInterpretationSchemaList } from "@/schemas/PackageMetadataInterpretationSchema";
import { convertToPackageSchema, convertToPackageSchemaList, TPackageSchema, TPackageSchemaList } from "@/schemas/PackageSchema";
import { AdminAuthService } from "@/services/AdminAuthService";
import createError from "@fastify/error";
import Decimal from "decimal.js";

const WrongSecretKeyError = createError('FST_ERR_AUTH', "Bạn đã nhập sai mã bí mật. Vui lòng kiểm tra và nhập lại.", 401);
const NoSuchAccountError = createError('FST_ERR_NOT_FOUND', "Tài khoản không tồn tại.", 404);

export class AdminController {
    constructor(
        private readonly adminRepository: AdminRepository,
        private readonly accountRepository: AccountRepository,
        private readonly customerServiceChatRepository: CustomerServiceChatRepository,
        private readonly customerServiceChatMessageRepository: CustomerServiceChatMessageRepository,
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

    async getAccounts(): Promise<TAccountSchemaList> {
        return this.accountRepository.findAll().then(convertToAccountSchemaList);
    }

    async createAccount(adminId: number, payload: TAccountCreateRequestBody): Promise<TAccountSchema> {
        return this.accountRepository.create({
            full_name: payload.full_name,
            phone_number: payload.phone_number,
            status: payload.status,
            created_by_admin_id: adminId,
            balance: new Decimal(0),
        }).then(convertToAccountSchema);
    }

    async deleteAccount(id: number): Promise<{ success: boolean }> {
        return {
            success: await this.accountRepository.delete(id),
        };
    }

    async updateAccountBalance(id: number, payload: TAccountBalanceUpdateRequestBody): Promise<TAccountSchema> {
        const newAccount = await this.accountRepository.update(id, {
            balance: new Decimal(payload.balance),
        });
        if (!newAccount) {
            throw new NoSuchAccountError();
        }
        return convertToAccountSchema(newAccount);
    }

    async getCustomerServiceChats(): Promise<TCustomerServiceChatSchemaList> {
        return await convertToCustomerServiceChatSchemaList(
            await this.customerServiceChatRepository.findAll(),
            (accountIds: number[]) => this.accountRepository.findAllByIds(accountIds),
        );
    }

    async getCustomerServiceChatMessages(customerServiceChatId: number): Promise<TCustomerServiceChatMessageSchemaList> {
        return await this.customerServiceChatMessageRepository
            .findAllByChatId(customerServiceChatId)
            .then(convertToCustomerServiceChatMessageSchemaList);
    }
}
