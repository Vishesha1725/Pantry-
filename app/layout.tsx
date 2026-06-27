import type { Metadata } from "next";
import { AppStateProvider } from "@/lib/app-state";
import { PageTransition } from "@/components/page-transition";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pantry Quest",
  description: "A cozy grocery quest for vegetarian meal planning, pantry freshness, and weekly shopping."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><AppStateProvider><PageTransition>{children}</PageTransition></AppStateProvider></body>
    </html>
  );
}
