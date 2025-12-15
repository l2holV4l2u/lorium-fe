import type { AppRouter } from "@lorium/backend/src/trpc/trpc.router";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
