import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User[];
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let authenticatedUser: User | null = null;

  try {
    authenticatedUser = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    authenticatedUser = null;
  }

  const user = authenticatedUser ? [authenticatedUser] : [];

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
