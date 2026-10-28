import type { Metadata } from "next";
// @ts-ignore - Next.js provides CSS import types through its generated environment declarations.
import "app/globals.css";

export const metadata: Metadata = {
  title: "Accoundle | The Daily Accounting Journal Puzzle",
  description: "Test your accounting knowledge with a daily GAAP/IFRS general journal entry puzzle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-stone-100 text-stone-900">{children}</body>
    </html>
  );
}