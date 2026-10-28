import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "accoundle | the daily accounting journal puzzle",
  description: "Test your accounting knowledge with a daily GAAP/IFRS general journal entry puzzle.",
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