import { redirect } from "next/navigation";
// import MarketplaceGrid from "../../component/MarketplaceGrid";


export default function Home() {
  
    // <main className="p-8">
    //   <h1 className="font-bold text-blue-500 text-2xl">
    //     Marketplace
    //   </h1>
    //   <MarketplaceGrid />
    // </main>
    redirect("/login");
}

