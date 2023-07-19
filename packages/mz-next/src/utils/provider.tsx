"use client";
// Custom Query Client Provider
import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DialogProvider } from "@/context/DialogContext";
import { UserProvider } from "@/context/UserContext";

function Providers({ children }: React.PropsWithChildren) {
  const [client] = useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 5 } } })
  );

  return (
    <QueryClientProvider client={client}>
      <DialogProvider>
        <UserProvider>{children}</UserProvider>
      </DialogProvider>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default Providers;
