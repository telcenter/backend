import { ChatType, ChatTypes } from "@/constants/chatTypes";
import { TERRAG_SOCKET_URL } from "@/env";
import { AccountRepository } from "@/repositories/AccountRepository";
import { CustomerServiceChatMessageRepository } from "@/repositories/CustomerServiceChatMessageRepository";
import { CustomerServiceChatRepository } from "@/repositories/CustomerServiceChatRepository";
import { TCustomerChatMessageCreateRequestBody } from "@/schemas/CustomerChatMessageCreateRequestBody";
import { TCustomerChatCreateRequestBody } from "@/schemas/CustomerServiceChatCreateRequestBody";
import { convertToCustomerServiceChatSchema, TCustomerServiceChatSchema } from "@/schemas/CustomerServiceChatSchema";
import { createFakeSocketIOClientInterface, createRealSocketIOClientInterface, SocketIOClientInterface } from "@/utils/socketIOClient";
import { RAGReplyChunk, RAGReplyChunkSchema, RAGSocketIOHelpers } from "@/utils/ragSocketIOHelpers";
import createError from "@fastify/error";
import { Value } from "@sinclair/typebox/value";
import { Senders } from "@/constants/senders";
import { Account } from "@prisma/client";
import { RAGInputSchema } from "@/schemas/RAGInputSchema";

const PhoneNumberNotRegisteredError = createError('FST_ERR_NOT_FOUND', "Thuê bao chưa đăng ký", 404);
const ChatNotFoundError = createError('FST_ERR_NOT_FOUND', "Không tìm thấy cuộc trò chuyện", 404);

export class ChatService {
    constructor(
        private customerServiceChatRepository: CustomerServiceChatRepository,
        private customerServiceChatMessageRepository: CustomerServiceChatMessageRepository,
        private accountRepository: AccountRepository,
    ) { }

    private async runTER({
        socketToTERRAG,
        customerMessage,
        customerSEREmotion,
    }: {
        socketToTERRAG: SocketIOClientInterface;
        customerMessage: string;
        customerSEREmotion: string | undefined;
    }): Promise<string> {
        if (TERRAG_SOCKET_URL === null) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return "tích cực";
        }

        let listening = true;
        const fusedEmotionPromise = new Promise<string>((resolve, reject) => {
            if (!listening) {
                return;
            }

            socketToTERRAG.on("ter-response", (emotion: any) => {
                if (!listening) {
                    return;
                }
                console.info("TER response:", emotion);
                resolve(emotion);
                listening = false;
            });
            socketToTERRAG.on("connect_error", (error: any) => {
                if (!listening) {
                    return;
                }
                // reject(new Error(`TER service connection error: ${error}`));
                resolve("tiêu cực, vì phải chờ lâu");
                listening = false;
            });
        });

        socketToTERRAG.emit("ter", {
            text: customerMessage,
            ser_emotion: customerSEREmotion,
        });

        const e = await fusedEmotionPromise;
        console.log("Promise resolved:", e);
        return e;
    }

    private async runRAG({
        socketToRAG,
        chatId,
        chatSummary,
        customerMessage,
        customerEmotion,
        onNewReplyMessageChunk,
    }: {
        socketToRAG: SocketIOClientInterface;
        chatId: number;
        chatSummary: string;
        customerMessage: string;
        customerEmotion: string | undefined;
        onNewReplyMessageChunk: (chunk: RAGReplyChunk) => any;
    }): Promise<Error | true> {
        try {
            RAGSocketIOHelpers.registerCommonStuff({
                socketToRAG,
                onNewReplyMessageChunk,
            });

            socketToRAG.emit("message", {
                chat_id: chatId,
                chat_summary: chatSummary,
                customer_message: customerMessage,
                customer_emotion: customerEmotion,
            });

            return true
        } catch (e) {
            if (e instanceof Error) {
                return e;
            }
            return new Error(`Error: ${e}`);
        }
    }

    private async sendCustomerMessageToTERRAG(
        chatId: number,
        payload: TCustomerChatMessageCreateRequestBody,
        onFusedEmotionReady: (fusedEmotion: string) => any,
        onNewReplyMessageChunk: (chunk: RAGReplyChunk) => any,
    ) {
        const chat = await this.customerServiceChatRepository.findById(chatId);
        if (!chat) {
            throw new ChatNotFoundError();
        }
        if (chat.type === ChatTypes.CALL && !payload.ser_emotion) {
            throw new Error("sendCustomerMessageToTERRAG(): ser_emotion is required for audio calls");
        }

        const socketToTERRAG = (null !== TERRAG_SOCKET_URL)
            ? createRealSocketIOClientInterface({ url: TERRAG_SOCKET_URL })
            : createFakeSocketIOClientInterface({
                process: async (_unknown_input, _unknown_sendData) => {
                    const input = Value.Decode(RAGInputSchema, _unknown_input);
                    const sendData = (data: RAGReplyChunk) => _unknown_sendData(Value.Encode(RAGReplyChunkSchema, data));

                    for (const data of [
                        "This ", "is ", "some ", "sample ", "output ", "from ", "the ", "LLM ", "service. ",
                        "Thank you ", "for using ", "our service ",
                        "(or actually, ", "testing it ", "out!). ",
                        "Your ", "input ", "was: ",
                    ]) {
                        await new Promise((resolve) => setTimeout(resolve, 100));
                        sendData({ is_finished: false, error: false, data });
                    }

                    sendData({ is_finished: true, error: false, data: input.customer_message });
                },
            });


        const fusedEmotion = await this.runTER({
            socketToTERRAG: socketToTERRAG,
            customerMessage: payload.text_content,
            customerSEREmotion: payload.ser_emotion,
        });
        onFusedEmotionReady(fusedEmotion);

        console.info(`Running RAG with fused emotion: ${fusedEmotion}`);
        this.runRAG({
            socketToRAG: socketToTERRAG,
            chatId,
            chatSummary: chat.summary,
            customerMessage: payload.text_content,
            customerEmotion: fusedEmotion,
            onNewReplyMessageChunk,
        });
    }



    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////



    async getAccountByPhoneNumber(phoneNumber: string): Promise<Account> {
        const account = await this.accountRepository.findByPhoneNumber(phoneNumber);
        if (!account) {
            throw new PhoneNumberNotRegisteredError();
        }
        return account;
    }

    async createChat(type: ChatType, payload: TCustomerChatCreateRequestBody): Promise<TCustomerServiceChatSchema> {
        const account = await this.getAccountByPhoneNumber(payload.phone_number);

        const chat = await this.customerServiceChatRepository.create({
            account_id: account.id,
            type,
            summary: "",
            customer_satisfaction: "Chưa đánh giá",
        });

        return convertToCustomerServiceChatSchema(chat, account);
    }

    async getChatById(chatId: number): Promise<TCustomerServiceChatSchema> {
        const chat = await this.customerServiceChatRepository.findByIdJoinedWithAccount(chatId);
        if (!chat) {
            throw new ChatNotFoundError();
        }
        return convertToCustomerServiceChatSchema(chat, chat.account);
    }

    async getChatByTypeAndId(type: string | null, chatId: number): Promise<TCustomerServiceChatSchema> {
        const chat = await this.customerServiceChatRepository.findByIdJoinedWithAccount(chatId);
        if (!chat || (type !== null && chat.type !== type)) {
            throw new ChatNotFoundError();
        }
        return convertToCustomerServiceChatSchema(chat, chat.account);
    }

    async customerSendsMessage(
        frontendSocket: SocketIOClientInterface,
        payload: TCustomerChatMessageCreateRequestBody,
    ) {
        let accumulatedMessageFromRAG = "";
        let fusedEmotion = "";
        this.sendCustomerMessageToTERRAG(
            payload.chat_id,
            payload,
            computedFusedEmotion => {
                fusedEmotion = computedFusedEmotion;
            },
            async chunk => {
                frontendSocket.emit("message", chunk);
                if (chunk.error === false) {
                    accumulatedMessageFromRAG += chunk.data;
                } else if (chunk.is_finished) {
                    /*const [userMessage, agentMessage] = */await Promise.all([
                    this.customerServiceChatMessageRepository.create({
                        chat_id: payload.chat_id,
                        text_content: payload.text_content,
                        emotion: fusedEmotion,
                        sender: Senders.USER,
                    }),

                    this.customerServiceChatMessageRepository.create({
                        chat_id: payload.chat_id,
                        text_content: accumulatedMessageFromRAG,
                        emotion: "",
                        sender: Senders.AGENT,
                    }),
                ]);
                }
            }
        )
    }
}
