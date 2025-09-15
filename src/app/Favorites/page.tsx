import FavoritesGrid from "../../component/FavoriteGrid";

export default function Favorites() {
  return (
    <main className="p-8">
      <h1 className="font-bold text-blue-500 text-2xl">
        Your Favorites
      </h1>
      <FavoritesGrid />
    </main>
  );
}