import { AppRouter } from "@lorium/trpc";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

export const trpcServer = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_TRPC_URL || "http://localhost:4000/trpc",
      fetch(url, options) {
        return fetch(url, {
          ...options,
          cache: "no-store",
        });
      },
    }),
  ],
});
