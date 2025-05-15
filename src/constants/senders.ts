export const Senders = {
    USER: "người dùng",
    AGENT: "nhân viên",
} as const;

export type Sender = typeof Senders[keyof typeof Senders];
