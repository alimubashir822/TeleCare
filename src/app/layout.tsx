import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import DemoSwitcher from "@/components/DemoSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TeleCare AI | Secure Telemedicine & Digital Clinic Platform",
  description: "Consult qualified doctors anywhere through secure video visits, manage medical records, receive digital prescriptions, and chat with your AI health assistant.",
  keywords: "telemedicine, health care, virtual clinic, medical assistant, AI doctor, secure consult",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        <AuthProvider>
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <DemoSwitcher />
        </AuthProvider>
      </body>
    </html>
  );
}
