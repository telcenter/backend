import Redis from "ioredis";

const channelName = "my-channel";

export class NotifyRAGServerService {
    constructor(
        private readonly redis: Redis,
    ) {}

    async notifyRAGServer() {
        this.redis.publish(channelName, "changed");
    }
}
