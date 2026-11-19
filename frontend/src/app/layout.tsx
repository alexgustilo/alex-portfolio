import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alex Gustilo | Full-Stack Developer",
  description:
    "Explore the portfolio, projects, technical skills, and development journey of Alex Gustilo.",
  applicationName: "Alex Portfolio",
  keywords: [
    "Alex Gustilo",
    "Web Developer",
    "Next.js",
    "React",
    "FastAPI",
    "Portfolio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
