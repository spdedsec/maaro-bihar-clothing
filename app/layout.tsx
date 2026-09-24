import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "../components/store-provider";

export const metadata: Metadata = {
  title: "MAARO BIHAR Clothing — Delhi ka rate, ab Patna mein",
  description:
    "MAARO BIHAR Clothing — men's wear, everyday fashion and wholesale-ready stock from Danapur, Patna.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
