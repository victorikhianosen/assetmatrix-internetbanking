import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Providers from "@/providers/contextProvider";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
  variable: "--font-roboto",
});


export const metadata: Metadata = {
  title: "Asset Matrix - Internet Banking",
  description: "Internet banking platform for asset matrix microfinance bank customers",
  keywords: [
    "asset matrix",
    "internet banking",
    "microfinance",
    "banking",
    "asset management",
    "financial services",
    "Transfer",
    "Loan",
    "Deposit",
    "Payment",
  ],
  icons: "/favicon.ico",
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
