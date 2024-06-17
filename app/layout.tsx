import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import ApolloClientProvider from "@/components/ApolloClientProvider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <ApolloClientProvider>
          <div className="flex-grow">{children}</div>
        </ApolloClientProvider>
        <Footer />
      </body>
    </html>
  );
}