// import { redirect } from "next/navigation";
import CategoryBar from "@/component/CategoryBar";
import MarketplaceGrid from "../../../component/MarketplaceGrid";
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";

export default function Home() {
  return (
    <main>
        <Navbar />
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Furniture</h1>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 px-4 py-6">

              
              <MarketplaceGrid category="Furniture" />
          </div>
        </div>
    </main>
  );
}