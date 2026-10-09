import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "DUALMIND — Teach to Learn. Learn to Teach.",
  description:
    "AI-powered active-learning EdTech platform. Don't just ask AI for answers. Prove that you understand them using the Feynman Technique.",
  keywords: [
    "Active Learning",
    "Feynman Technique",
    "EdTech",
    "AI Sparring Partner",
    "Knowledge Mastery",
    "Adaptive Quizzes",
  ],
  authors: [{ name: "DUALMIND Architecture Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        {children}
      </body>
    </html>
  );
}
