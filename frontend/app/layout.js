import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "PropertiGuard 🛡️",
  description: "AI-Powered Legal Assistant for Property Contracts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-slate-950 text-slate-50 antialiased selection:bg-blue-500/30 selection:text-blue-200`}>
        <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-sm">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-2xl text-slate-100 tracking-tight">
              <span className="text-2xl">🛡️</span>
              <span className="text-blue-500">PropertiGuard</span>
            </div>
          </div>
        </nav>

        <main className="min-h-screen relative">{children}</main>
      </body>
    </html>
  );
}
