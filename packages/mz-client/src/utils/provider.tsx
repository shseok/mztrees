"use client";
// Custom Query Client Provider
import { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DialogProvider } from "@/context/DialogContext";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TabScrollTopContextProvider } from "@/context/TabScrollTopContext";
import AnalyticsTrackingEventsProvider from "./AnalyticsTrackingEventsProvider";
import { SearchModalProvider } from "@/context/SearchModalContext";
import { GifSelectorProvider } from "@/context/GifSelectorContext";

function Providers({ children }: React.PropsWithChildren) {
  const [client] = useState(
    new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 6 } } })
  );

  return (
    <AnalyticsTrackingEventsProvider>
      <QueryClientProvider client={client}>
        <ThemeProvider>
          <SearchModalProvider>
            <GifSelectorProvider>
              <DialogProvider>
                <TabScrollTopContextProvider>
                  <UserProvider>{children}</UserProvider>
                </TabScrollTopContextProvider>
              </DialogProvider>
            </GifSelectorProvider>
          </SearchModalProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </AnalyticsTrackingEventsProvider>
  );
}

export default Providers;
