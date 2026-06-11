import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "ASTRA",
  description: "ASTRA landing page with a built-in CMS, language switching, and auth-gated cart access."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#111111",
              borderRadius: "18px"
            },
            elements: {
              overlay: "clerk-overlay",
              modalContent: "clerk-modal",
              card: "clerk-card",
              headerTitle: "clerk-header-title",
              headerSubtitle: "clerk-header-subtitle",
              socialButtonsBlockButton: "clerk-social-button",
              formButtonPrimary: "clerk-primary-button",
              footerActionLink: "clerk-footer-link",
              formFieldInput: "clerk-input"
            }
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
