export const ChatTypes = {
    TEXT: "nhắn tin",
    CALL: "gọi điện",
} as const;

export type ChatType = typeof ChatTypes[keyof typeof ChatTypes];
