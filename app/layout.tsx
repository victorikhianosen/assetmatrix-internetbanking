import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Providers from "@/providers/contextProvider";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Asset Matrix - Internet Banking",
  description:
    "Access Asset Matrix Microfinance Bank's secure internet banking platform. Transfer funds, manage your account, and perform financial transactions easily online.",
  keywords: [
    "asset matrix",
    "internet banking",
    "microfinance",
    "banking",
    "asset management",
    "financial services",
    "financial technology",
    "Transfer",
    "Deposit",
    "Payment",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/assets/images/apple-touch-icon.png",
  },
  openGraph: {
    title: "Asset Matrix - Internet Banking",
    description:
      "Asset Matrix is an internet banking platform that provides microfinance services to customers in Nigeria. It offers a range of financial products and services, including loan, deposit, and payment options.",
    url: "https://assetmatrixmfb.com/",
    siteName: "Asset Matrix",
    type: "website",
    locale: "en_NG",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${roboto.variable}`}>
        <Providers>
          {children}
          <ToastContainer position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
