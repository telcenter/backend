import { ChatTypes } from "@/constants/chatTypes";
import { AccountRepository } from "@/repositories/AccountRepository";
import { CustomerServiceChatMessageRepository } from "@/repositories/CustomerServiceChatMessageRepository";
import { CustomerServiceChatRepository } from "@/repositories/CustomerServiceChatRepository";
import { convertToAccountSchema, TAccountSchema } from "@/schemas/AccountSchema";
import { TCustomerChatMessageCreateRequestBody } from "@/schemas/CustomerChatMessageCreateRequestBody";
import { TCustomerChatCreateRequestBody } from "@/schemas/CustomerServiceChatCreateRequestBody";
import { convertToCustomerServiceChatMessageSchemaList, TCustomerServiceChatMessageSchemaList } from "@/schemas/CustomerServiceChatMessageSchema";
import { convertToCustomerServiceChatSchema, convertToCustomerServiceChatSchemaList, TCustomerServiceChatSchema, TCustomerServiceChatSchemaList } from "@/schemas/CustomerServiceChatSchema";
import { ChatService } from "@/services/ChatService";
import { SocketIOClientInterface } from "@/utils/socketIOClient";

export class ChatController {
    constructor(
        private readonly customerServiceChatRepository: CustomerServiceChatRepository,
        private readonly customerServiceChatMessageRepository: CustomerServiceChatMessageRepository,
        private readonly accountRepository: AccountRepository,
        private readonly chatService: ChatService,
    ) { }

    async getAccountByPhoneNumber(phoneNumber: string): Promise<TAccountSchema> {
        const account = await this.chatService.getAccountByPhoneNumber(phoneNumber);
        return convertToAccountSchema(account);
    }

    async createTextChat(payload: TCustomerChatCreateRequestBody): Promise<TCustomerServiceChatSchema> {
        return this.chatService.createChat(ChatTypes.TEXT, payload);
    }

    async createAudioCall(payload: TCustomerChatCreateRequestBody): Promise<TCustomerServiceChatSchema> {
        return this.chatService.createChat(ChatTypes.CALL, payload);
    }

    async getChats(accountId: number): Promise<TCustomerServiceChatSchemaList> {
        return this.customerServiceChatRepository.findAllByAccountId(accountId)
            .then(chats => convertToCustomerServiceChatSchemaList(
                chats,
                accountIds => this.accountRepository.findAllByIds(accountIds),
            ));
    }

    async getChatById(accountId: number, chatId: number): Promise<TCustomerServiceChatSchema> {
        const chat = await this.chatService.getChatById(chatId);
        if (!chat || chat.account_id !== accountId) {
            throw new Error("Chat not found or access denied");
        }
        return chat;
    }

    async customerSendsMessage(
        frontendSocket: SocketIOClientInterface,
        payload: TCustomerChatMessageCreateRequestBody,
    ) {
        return this.chatService.customerSendsMessage(frontendSocket, payload);
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
};
