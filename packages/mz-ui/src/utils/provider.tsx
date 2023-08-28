"use client";
import { ThemeProvider } from "@/context/ThemeContext";

function Providers({ children }: React.PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

export default Providers;
