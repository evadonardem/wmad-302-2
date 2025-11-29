import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  Book,
  Film,
  Music,
  Tv,
  Gamepad2,
  Palette,
  Atom,
  Cpu,
  Brain,
  Microscope,
  Globe,
  Users,
  Award,
  Dog,
  Car,
  Laugh,
  Landmark,
  BookOpen,
  Theater,
  Shapes,
} from "lucide-react";

type Category = {
  id: number;
  name: string;
};

const categoryIcons: Record<string, any> = {
  "General Knowledge": BookOpen,
  "Entertainment: Books": Book,
  "Entertainment: Film": Film,
  "Entertainment: Music": Music,
  "Entertainment: Television": Tv,
  "Entertainment: Video Games": Gamepad2,
  "Entertainment: Board Games": Shapes,
  "Entertainment: Comics": Palette,
  "Entertainment: Japanese Anime & Manga": Laugh,
  "Entertainment: Cartoon & Animations": Theater,
  "Entertainment: Musicals & Theatres": Theater,
  "Science & Nature": Atom,
  "Science: Computers": Cpu,
  "Science: Mathematics": Brain,
  "Science: Gadgets": Microscope,
  Mythology: Landmark,
  Sports: Award,
  Geography: Globe,
  History: Book,
  Politics: Users,
  Art: Palette,
  Celebrities: Award,
  Animals: Dog,
  Vehicles: Car,
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://opentdb.com/api_category.php");
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        if (!data.trivia_categories) throw new Error("Invalid API response format.");
        setCategories(data.trivia_categories);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError("Unable to load categories from Open Trivia API.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto px-4 py-8">
      <div>
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-text-slide">
          Categories
        </h2>
        <p className="text-muted-foreground text-center mt-2">
          Choose a category to start your trivia quiz.
        </p>
      </div>

      <Separator className="my-4" />

      {loading ? (
        <p className="text-center text-lg text-muted-foreground animate-pulse">
          Loading categories...
        </p>
      ) : error ? (
        <p className="text-center text-red-500 text-lg">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-red-500 text-lg">No categories available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.name] || Shapes;
            return (
              <Card
                key={cat.id}
                onClick={() => navigate(`/quiz/${cat.id}`)}
                className="cursor-pointer p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[220px]
                  bg-background/60 dark:bg-background/60
                  border border-white/10 dark:border-white/20
                  rounded-2xl
                  shadow-lg hover:shadow-2xl
                  transition-all duration-300
                  hover:scale-105
                  relative overflow-hidden
                  before:absolute before:inset-0 before:rounded-2xl before:opacity-0 hover:before:opacity-30
                  hover:before:bg-white/10 dark:hover:before:bg-white/20"
              >
                <div
                  className="w-20 h-20 flex items-center justify-center rounded-full
                    bg-gradient-to-tr from-purple-400 via-pink-500 to-red-500
                    text-white shadow-md dark:shadow-white/30 transition-all duration-300
                    hover:scale-110"
                >
                  <Icon size={36} />
                </div>
                <CardTitle className="text-lg font-semibold text-foreground dark:text-white break-words leading-snug">
                  {cat.name}
                </CardTitle>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Categories;
