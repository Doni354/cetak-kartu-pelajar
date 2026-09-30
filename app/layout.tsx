import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cetak Kartu Pelajar",
  description: "Aplikasi cetak kartu pelajar untuk sekolah",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#fff",
              color: "#1a1a2e",
              borderRadius: "12px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
