import createError from "@fastify/error";
import { FastifyReply, FastifyRequest } from "fastify";

const NoPhoneNumberError = createError('FST_ERR_VALIDATION', "Thiếu thông tin thuê bao", 400);

export async function accountAuth(req: FastifyRequest, rep: FastifyReply) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        throw new NoPhoneNumberError();
    }

    const accountId = +authHeader.replace(/^Bearer\s/, "");
    if (!accountId || isNaN(accountId) || !isFinite(accountId)) {
        throw new NoPhoneNumberError();
    }

    const account = await req.server.repositories.accountRepository.findById(accountId);
    if (!account) {
        throw new NoPhoneNumberError();
    }
    
    req.account = account;
}
