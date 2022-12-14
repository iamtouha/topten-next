import { USER_ROLE } from "@prisma/client";
import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: USER_ROLE;
    active: boolean;
    profileId?: string;
  }
  interface Session {
    user?: User;
  }
}
