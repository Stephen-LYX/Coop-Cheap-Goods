// import { redirect } from "next/navigation";
import CategoryBar from "@/component/CategoryBar";
import MarketplaceGrid from "../../../component/MarketplaceGrid";
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";

export default function Home() {
  return (
    <main>
        <Navbar />
        <CategoryBar />
        <div className="px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Toys & Games</h1>
            <MarketplaceGrid category="toys&games" />
        </div>
    </main>
  );
}