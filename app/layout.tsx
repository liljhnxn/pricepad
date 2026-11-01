import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "PricePad | Simple pricing. Easy sharing.",
  description:
    "Decentralized pricing and service records for freelancers and small businesses on Botchain Testnet.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0f1015] text-[#e4e4eb] antialiased min-h-screen selection:bg-purple-900 selection:text-purple-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
