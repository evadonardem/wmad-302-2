import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Star, Play, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

type Category = { id: number; name: string };

interface FavoriteCategory {
  id: string;
  name: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>("any");
  const [favoriteCategories, setFavoriteCategories] = useState<FavoriteCategory[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const colors = [
    "bg-blue-50 text-blue-800 border-blue-200",
    "bg-green-50 text-green-800 border-green-200",
    "bg-yellow-50 text-yellow-800 border-yellow-200",
    "bg-purple-50 text-purple-800 border-purple-200",
    "bg-pink-50 text-pink-800 border-pink-200",
    "bg-indigo-50 text-indigo-800 border-indigo-200",
    "bg-teal-50 text-teal-800 border-teal-200",
    "bg-orange-50 text-orange-800 border-orange-200",
  ];

  useEffect(() => {
    setLoading(true);
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.trivia_categories || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load categories");
        setLoading(false);
      });
  }, []);

  // Load favorite categories from localStorage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("favoriteCategories");
      if (savedFavorites) {
        setFavoriteCategories(JSON.parse(savedFavorites));
      }
    } catch {
      setFavoriteCategories([]);
    }
  }, []);

  const persistFavoriteCategories = (favorites: FavoriteCategory[]) => {
    localStorage.setItem("favoriteCategories", JSON.stringify(favorites));
  };

  const isCategoryFavorite = (categoryId: string) => {
    return favoriteCategories.some(fav => fav.id === categoryId);
  };

  const addToFavorites = () => {
    if (selected === "any") return;

    const category = categories.find(c => String(c.id) === selected);
    if (!category) return;

    const newFavorite: FavoriteCategory = {
      id: selected,
      name: category.name
    };

    if (!isCategoryFavorite(selected)) {
      const updatedFavorites = [...favoriteCategories, newFavorite];
      setFavoriteCategories(updatedFavorites);
      persistFavoriteCategories(updatedFavorites);

      setSuccessMessage(`"${category.name}" added to favorites!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const useCategory = (categoryId: string = selected) => {
    const categoryToUse = categoryId === "any" ? null : categoryId;
    localStorage.setItem("selectedCategory", JSON.stringify(categoryToUse));
    
    navigate("/Dashboard?refresh=" + Date.now());
  };

  return (
    <div className="p-6 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl">
        <Card className="shadow-lg bg-white border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-gray-900">Categories</CardTitle>
            <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pick a category or browse the list — click a tile to select. Add to favorites for quick access.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {error && (
              <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center justify-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
                <p className="text-green-700 font-medium">{successMessage}</p>
              </div>
            )}

            {/* Select + buttons */}
            <div className="flex flex-col md:flex-row items-stretch gap-4 max-w-4xl mx-auto">
              <div className="flex-1">
                <label className="text-sm font-medium mb-3 block text-gray-700">Select Category</label>
                <Select value={selected} onValueChange={setSelected}>
                  <SelectTrigger className="w-full h-12 text-base" disabled={loading}>
                    <SelectValue placeholder={loading ? "Loading categories…" : "Any Category"} />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="text-sm font-semibold">Categories</SelectLabel>
                      <SelectItem value="any" className="text-base">Any Category</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)} className="text-base">
                          <div className="flex items-center gap-3">
                            <span>{c.name}</span>
                            {isCategoryFavorite(String(c.id)) && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={addToFavorites}
                  disabled={selected === "any" || isCategoryFavorite(selected)}
                  className="h-12 px-6 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <Star className="w-4 h-4" /> Add to Favorites
                </Button>
                <Button
                  onClick={() => useCategory()}
                  disabled={loading}
                  className="h-12 px-6 bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <Play className="w-4 h-4" /> Use Category
                </Button>
              </div>
            </div>

            {/* Grid categories */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-6 text-center text-gray-900">Browse Categories</h3>
              <div className="max-h-96 overflow-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {categories.map((c, index) => {
                    const isSelected = String(c.id) === selected;
                    const isFavorited = isCategoryFavorite(String(c.id));
                    const colorClass = colors[index % colors.length];
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelected(String(c.id))}
                        className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                          ${isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"}
                          ${colorClass}
                          ${isFavorited ? "border-l-4 border-l-yellow-400" : ""}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg font-semibold">{c.name}</h4>
                            {isFavorited && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Categories;