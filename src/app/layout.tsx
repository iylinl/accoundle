import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "accoundle | daily accounting puzzle",
  description: "Test your accounting knowledge with a daily GAAP/IFRS general journal entry puzzle.",
  icons: {
    icon: "/icon.png?v=2",
    shortcut: "/icon.png?v=2",
    apple: "/icon.png?v=2",
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