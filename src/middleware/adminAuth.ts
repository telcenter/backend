import createError from "@fastify/error";
import { FastifyReply, FastifyRequest } from "fastify";

const UnauthenticatedError = createError('FST_ERR_AUTH', "Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.", 401);

export async function adminAuth(req: FastifyRequest, rep: FastifyReply) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        throw new UnauthenticatedError();
    }

    const token = authHeader.replace(/^Bearer\s/, "");
    if (!token) {
        throw new UnauthenticatedError();
    }

    req.admin = await req.server.services.adminAuthService.verifyToken(token);
}
