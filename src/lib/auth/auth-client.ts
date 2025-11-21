// lib/auth/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { signOut, useSession, signIn } = authClient;