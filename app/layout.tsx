import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/nav/NavBar";
import Footer from "./components/footer/Footer";
import CartProvider from "@/providers/CartProvider";
import { Poppins } from "next/font/google";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "E-SHOP",
  description:
    "A comprehensive Next.js e-commerce tutorial covering app setup, product listings, shopping cart functionality, user authentication, Stripe payment processing, and the development of an Admin Dashboard for complete product and order management.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} text-slate-700`}>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            {/* <main className="flex flex-grow">{children}</main> */}
            <main className="">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
