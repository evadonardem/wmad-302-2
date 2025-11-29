import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Question = {
  id: string;
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

const Favorites = () => {
  const [favorites, setFavorites] = useState<Question[]>([]);

  // Load favorites from localStorage
  const loadFavorites = () => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(stored);
  };

  useEffect(() => {
    loadFavorites();

    // Listen for changes in localStorage from other tabs/components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "favorites") loadFavorites();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const removeFavorite = (questionId: string) => {
    const filtered = favorites.filter((item) => item.id !== questionId);
    setFavorites(filtered);
    localStorage.setItem("favorites", JSON.stringify(filtered));
  };

  if (favorites.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-8 py-8">
        <h2 className="text-3xl font-bold tracking-tight text-center">
          ⭐ Favorite Questions
        </h2>
        <Separator />
        <p className="text-center text-muted-foreground">No favorite questions yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-8">
      <h2 className="text-3xl font-bold tracking-tight text-center">
        ⭐ Favorite Questions
      </h2>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {favorites.map((fav) => (
          <Card
            key={fav.id}
            className="shadow-md transition-transform hover:scale-[1.02] hover:shadow-lg 
                       dark:hover:shadow-purple-700/50 hover:shadow-purple-300/50"
          >
            <CardHeader>
              <CardTitle
                className="text-base break-words"
                dangerouslySetInnerHTML={{ __html: fav.question }}
              />
              <p className="text-sm text-muted-foreground mt-2">{fav.category}</p>
            </CardHeader>

            <CardContent>
              <p className="font-semibold">Correct Answer:</p>
              <p
                className="mb-4 break-words"
                dangerouslySetInnerHTML={{ __html: fav.correct_answer }}
              />
              <Button
                variant="destructive"
                onClick={() => removeFavorite(fav.id)}
              >
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
