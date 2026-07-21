import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WorkOS AI — Automate Your Work in Plain English",
  description:
    "Describe your workflow. AI builds it. Connects your apps. Runs it. No coding or manual setup required.",
  openGraph: {
    title: "WorkOS AI — Automate Your Work in Plain English",
    description:
      "Describe your workflow. AI builds it. Connects your apps. Runs it. No coding or manual setup required.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WorkOS AI — Automate Your Work in Plain English",
    description:
      "Describe your workflow. AI builds it. Connects your apps. Runs it. No coding or manual setup required.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
