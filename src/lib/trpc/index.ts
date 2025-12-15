import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@lorium/trpc";

export const trpc = createTRPCReact<AppRouter>();
