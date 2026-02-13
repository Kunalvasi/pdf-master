import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AppToaster } from "@/components/layout/toaster";

const font = Space_Grotesk({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDFMaster | Fast and Secure PDF Tools",
  description: "Merge, compress, and convert PDF files with private 24-hour storage.",
  keywords: ["pdf tools", "merge pdf", "compress pdf", "pdf to word"]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
            <Footer />
          </div>
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
