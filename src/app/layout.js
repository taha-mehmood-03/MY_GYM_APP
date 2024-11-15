// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    
    <div className={inter.className}>
      {children}
    </div>
  );
}
