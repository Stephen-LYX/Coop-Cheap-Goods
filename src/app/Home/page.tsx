// import { redirect } from "next/navigation";
import MarketplaceGrid from "../../component/MarketplaceGrid";
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";

export default function Home() {
  return (
    <main>
        <Navbar />

        <div className="flex">
            <Sidebar />
            <div>
                <h1 className="font-bold text-blue-500 text-2xl m-4">
                    Marketplace
                </h1>

                <MarketplaceGrid />
            </div>
        </div>
    </main>
  );
}