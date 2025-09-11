import { redirect } from "next/navigation";
import MarketplaceGrid from "../../component/MarketplaceGrid";

export default function Home() {
  redirect("/Login");
}


export default function Home() {
  return (
    <main>
      <h1 className="font-bold text-blue-500 text-2xl">
        <MarketplaceGrid />
      </h1>
    </main>
  );
}