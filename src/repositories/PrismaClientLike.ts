/**
 * Note that this may break in the future if Prisma changes the types.
 * 
 * PrismaClientLike is meant to be a type that is a subset of both PrismaClient
 * and the type of transaction-dependent PrismaClient i.e. the type of tx in
 * this command:
 * 
 *      prisma.$transaction(async (tx) => {
 *          ...
 *      });
 * 
 * Refer to the Prisma docs for more information on transactions.
 */

import * as runtime from '@prisma/client/runtime/library.js';
import { PrismaClient } from "@prisma/client";

export type PrismaClientLike = Omit<PrismaClient, runtime.ITXClientDenyList>;
