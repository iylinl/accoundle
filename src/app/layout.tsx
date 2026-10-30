import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: "accoundle - Daily Accounting Journal Entry",
  description: "Daily accounting ledger challenge.",
  icons: {
    icon: [
      {
        url: "/icon.png?v=2",
        href: "/icon.png?v=2",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#090a0f] text-zinc-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}

