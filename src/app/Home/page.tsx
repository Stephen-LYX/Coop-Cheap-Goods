// import { redirect } from "next/navigation";
import CategoryBar from "@/component/CategoryBar";
import MarketplaceGrid from "../../component/MarketplaceGrid";
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";

export default function Home() {
  return (
    <main>
        <Navbar />
        <CategoryBar />
        <div>
            <MarketplaceGrid />
        </div>
    </main>
  );
}