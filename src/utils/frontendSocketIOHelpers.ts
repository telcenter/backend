import { SocketIOClientInterface } from "./socketIOClient";
import { Static, TSchema } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

export class FrontendSocketIOHelpers {
    static notifyErrorAndDisconnectSocket = ({ socketFromFrontend, error }: {
        socketFromFrontend: SocketIOClientInterface,
        error: string,
    }) => {
        socketFromFrontend.emit("message", {
            is_finished: true,
            error,
        });

        socketFromFrontend.disconnect();
    };

    static addUserMessageEventListener = <T extends TSchema>({ socketFromFrontend, onUserMessage, validationSchema }: {
        socketFromFrontend: SocketIOClientInterface,
        onUserMessage: (data: Static<T>) => Promise<void>,
        validationSchema: T,
    }) => {
        socketFromFrontend.on("message", async (raw_data: any) => {
            try {
                const data = Value.Decode(validationSchema, raw_data);
                await onUserMessage(data);
            } catch (error) {
                FrontendSocketIOHelpers.notifyErrorAndDisconnectSocket({
                    socketFromFrontend,
                    error: "" + error,
                });
            }
        });
    };
}
