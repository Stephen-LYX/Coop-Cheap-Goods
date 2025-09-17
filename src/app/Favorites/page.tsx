import FavoritesGrid from "../../component/FavoriteGrid";
import Navbar from "@/component/Navbar";
import Sidebar from "@/component/Sidebar";

export default function Favorites() {
  return (
    <main className="">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div>
          <h1 className="font-bold text-blue-500 text-2xl p-8">
            Your Favorites
          </h1>
          <FavoritesGrid />
        </div>
      </div>
    </main>
  );
}