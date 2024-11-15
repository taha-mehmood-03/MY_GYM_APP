import * as React from "react";
import { NextUIProvider } from "@nextui-org/react"; // Import with alias

export default function NextUiprovider({ children }) {
  // Wrap NextUIProvider at the root of your app
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  );
}