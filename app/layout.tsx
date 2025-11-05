import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "ระบบจัดการการเข้าเรียน",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="bg-gray-100">
        <SessionProviderWrapper>
          <Navbar />
          {children}
          <Toaster richColors position="bottom-right" />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
