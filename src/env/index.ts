import 'dotenv/config';
import { NumberEnvRequirement, readBooleanEnv, readNonEmptyStringEnv, readNumberEnv, readOptionalStringEnv, readStringListEnv } from '@/utils/env';

export const DEBUG: boolean = readBooleanEnv('DEBUG');
export const ENABLE_LOGGING: boolean = readBooleanEnv('ENABLE_LOGGING');
export const SERVER_PORT: number = readNumberEnv('SERVER_PORT', NumberEnvRequirement.MUST_BE_POSITIVE_OR_ZERO);
export const TRUST_PROXY: boolean|string|number = readEnv_TRUST_PROXY();

export const SECRET_KEY: string = readNonEmptyStringEnv('SECRET_KEY');
export const FRONTEND_SECRET: string = readNonEmptyStringEnv('FRONTEND_SECRET');
export const CORS_ALLOW_ORIGINS: string[] = readStringListEnv('CORS_ALLOW_ORIGIN', {
    ignoreEmptySegments: true,
});

export const DATABASE_URL: string = readNonEmptyStringEnv('DATABASE_URL');
export const SHADOW_DATABASE_URL: string = readNonEmptyStringEnv('SHADOW_DATABASE_URL');

export const TERRAG_SOCKET_URL: string | null = readOptionalStringEnv('TERRAG_SOCKET_URL');

export const REDIS_URL: string = readNonEmptyStringEnv('REDIS_URL');

function readEnv_TRUST_PROXY() {
    const trustProxy = readNonEmptyStringEnv('TRUST_PROXY');

    // boolean
    if (trustProxy === "true") return true;
    if (trustProxy === "false") return false;

    // string
    if (isNaN(Number(trustProxy)) || trustProxy.includes('.')) {
        // It is not an integer, so it must be string
        return trustProxy;
    }

    // number
    return parseInt(trustProxy);
}
