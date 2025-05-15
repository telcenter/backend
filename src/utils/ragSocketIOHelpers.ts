import { SocketIOClientInterface } from "./socketIOClient";

import { Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

export const RAGReplyChunkSchema = Type.Object({
    is_finished: Type.Boolean(),
    error: Type.Boolean(),
    data: Type.String(),
});

export type RAGReplyChunk = Static<typeof RAGReplyChunkSchema>;

export class RAGSocketIOHelpers {
    static registerCommonStuff = ({ socketToRAG, onNewReplyMessageChunk }: {
        socketToRAG: SocketIOClientInterface,
        onNewReplyMessageChunk: (data: RAGReplyChunk) => any,
    }) => {
        socketToRAG.on("message-response", _unknown_data => {
            let data: RAGReplyChunk;
            try {
                data = Value.Decode(RAGReplyChunkSchema, _unknown_data);
            } catch (e) {
                return RAGSocketIOHelpers.notifyErrorAndDisconnectSocket({
                    socketToRAG,
                    onNewReplyMessageChunk,
                    error: `${e}`,
                });
            }

            try {
                onNewReplyMessageChunk(data);
            } catch (e) {
                console.error(`Fatal error while calling onNewReplyMessageChunk() for TER+RAG model: ${e}`);
            }

            if (data.is_finished) {
                return socketToRAG.disconnect();
            }
        });

        socketToRAG.on("connect_error", _unknown_error => {
            const error = "" + _unknown_error;
            console.error(`Error: Connection to TER+RAG service failed.`, error);
            RAGSocketIOHelpers.notifyErrorAndDisconnectSocket({
                socketToRAG,
                onNewReplyMessageChunk,
                error: `Error: Connection to TER+RAG service failed: ${error}`,
            });
        });

        socketToRAG.on("disconnect", _unknown_reason => {
            const reason = "" + _unknown_reason;
            console.log(`Socket to TER+RAG disconnected:`, reason);
        });
    };

    static notifyErrorAndDisconnectSocket = ({ socketToRAG: _unused, onNewReplyMessageChunk, error }: {
        socketToRAG: SocketIOClientInterface,
        onNewReplyMessageChunk: (data: RAGReplyChunk) => any,
        error: string,
    }) => {
        onNewReplyMessageChunk({
            is_finished: true,
            error: true,
            data: `Error: TER+RAG: ${error}`,
        });
        // Because is_finished is true, the socket will be disconnected due to the first listener in registerCommonSocketIOEventListeners above.
    };
};
