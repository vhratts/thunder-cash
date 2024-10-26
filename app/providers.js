// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }) {
  return <NextUIProvider><main className="dark text-foreground bg-background">{children}</main></NextUIProvider>;
}
