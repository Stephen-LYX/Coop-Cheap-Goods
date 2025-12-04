"use client";

import { usePathname } from "next/navigation";
import Footer from "../component/Footer";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter = pathname === "/inbox" || pathname?.startsWith("/inbox");

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 flex flex-col">
        <main className="relative overflow-hidden flex-1">
          {children}
        </main>
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
}
