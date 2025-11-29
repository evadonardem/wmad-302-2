import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const cards = [
    {
      title: "Welcome to Open Trivia!",
      description:
        "Your ultimate trivia quiz application. Navigate through categories, manage favorites, and explore questions from all around the world.",
      lightFrom: "from-purple-400",
      lightTo: "to-pink-500",
      darkFrom: "from-purple-700",
      darkTo: "to-pink-600",
    },
    {
      title: "Customize Your Experience",
      description:
        "Set your preferences like number of questions, difficulty, and answer shuffle for a personalized quiz.",
      lightFrom: "from-green-400",
      lightTo: "to-blue-500",
      darkFrom: "from-green-600",
      darkTo: "to-blue-700",
    },
    {
      title: "Track Your Progress",
      description:
        "Check your scores, revisit favorite questions, and improve over time.",
      lightFrom: "from-yellow-400",
      lightTo: "to-orange-500",
      darkFrom: "from-yellow-600",
      darkTo: "to-orange-600",
    },
  ];

  return (
    <div className="space-y-12 px-6 pt-8 pb-20 max-w-6xl mx-auto">
      <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-purple-600 dark:via-pink-600 dark:to-red-600 animate-text-slide drop-shadow-lg">
        Open Trivia Dashboard
      </h1>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, idx) => (
          <Card
            key={idx}
            className={`p-6 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 
            bg-gradient-to-br ${card.lightFrom} ${card.lightTo} dark:${card.darkFrom} dark:${card.darkTo} text-white`}
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold drop-shadow-md">{card.title}</CardTitle>
            </CardHeader>
            <CardContent className="mt-4 text-white/90 dark:text-white/80 text-base leading-relaxed drop-shadow-sm">
              {card.description}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer credit */}
      <p className="text-center text-xs text-gray-700 dark:text-gray-300 mt-12">
        Developed by{" "}
        <span className="font-semibold hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
          Khenert Catayao
        </span>{" "}
        &{" "}
        <span className="font-semibold hover:text-purple-500 dark:hover:text-purple-400 transition-colors">
          Allen Telligo
        </span>
      </p>
    </div>
  );
};

export default Dashboard;
