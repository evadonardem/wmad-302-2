import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

type Question = {
  id: string;
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

const FALLBACK_QUESTIONS: Question[] = [
  {
    id: "1",
    category: "General Knowledge",
    type: "multiple",
    difficulty: "easy",
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["London", "Berlin", "Madrid"],
  },
  {
    id: "2",
    category: "Science & Nature",
    type: "multiple",
    difficulty: "medium",
    question: "What gas do plants absorb from the atmosphere?",
    correct_answer: "Carbon Dioxide",
    incorrect_answers: ["Oxygen", "Nitrogen", "Hydrogen"],
  },
  {
    id: "3",
    category: "Entertainment: Music",
    type: "multiple",
    difficulty: "easy",
    question: "Who is known as the 'King of Pop'?",
    correct_answer: "Michael Jackson",
    incorrect_answers: ["Elvis Presley", "Prince", "Madonna"],
  },
];

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    return stored.map((q: Question) => q.id);
  });

  // TIMER STATES
  const timerEnabled = localStorage.getItem("otq_timerEnabled") === "true";
  const timerDuration = Number(localStorage.getItem("otq_timerDuration") || 20);
  const [timer, setTimer] = useState<number>(timerDuration);

  // QUIZ SETTINGS
  const numQuestions = Number(localStorage.getItem("otq_numQuestions") || 10);
  const difficulty = localStorage.getItem("otq_difficulty") || "any";
  const shuffleEnabled = localStorage.getItem("otq_shuffleAnswers") === "true";

  // Reset timer every time a new question loads
  useEffect(() => {
    if (timerEnabled) setTimer(timerDuration);
  }, [current]);

  // Fetch Questions
  const fetchQuestions = async () => {
    setLoading(true);

    const fetchOpenTrivia = async (): Promise<Question[] | null> => {
      try {
        const validDiff = ["easy", "medium", "hard"].includes(difficulty)
          ? difficulty
          : undefined;

        const categoryParam = id ? `&category=${id}` : "";
        const diffParam = validDiff ? `&difficulty=${validDiff}` : "";

        const url = `https://opentdb.com/api.php?amount=${numQuestions}&type=multiple${categoryParam}${diffParam}`;
        const res = await fetch(url);
        if (res.status === 429) return null;
        const data = await res.json();
        if (data.results?.length > 0)
          return data.results.map((q: any, i: number) => ({ ...q, id: i.toString() }));
        return null;
      } catch {
        return null;
      }
    };

    const fetchTriviaAPI = async (): Promise<Question[] | null> => {
      try {
        const url = `https://the-trivia-api.com/api/questions?limit=${numQuestions}`;
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        if (data.length === 0) return null;
        return data.map((q: any, i: number) => ({
          id: i.toString(),
          category: q.category,
          type: "multiple",
          difficulty: q.difficulty,
          question: q.question,
          correct_answer: q.correctAnswer,
          incorrect_answers: q.incorrectAnswers,
        }));
      } catch {
        return null;
      }
    };

    let result: Question[] | null = await fetchOpenTrivia();
    if (!result) result = await fetchTriviaAPI();
    if (!result) result = FALLBACK_QUESTIONS;

    setQuestions(result);
    prepareOptions(result[0]);
    setLoading(false);
  };

  // Prepare Options
  const prepareOptions = (q: Question) => {
    let opts = [...q.incorrect_answers, q.correct_answer];
    if (shuffleEnabled) opts.sort(() => Math.random() - 0.5);
    setShuffledOptions(opts);
  };

  const handleAnswer = (ans: string) => {
    setSelected(ans);
    if (ans === questions[current].correct_answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      const nextIndex = current + 1;
      setCurrent(nextIndex);
      setSelected(null);
      prepareOptions(questions[nextIndex]);
    } else {
      setShowResult(true);
    }
  };

  // FIXED TIMER: runs only when question changes
  useEffect(() => {
    if (!timerEnabled || questions.length === 0) return;

    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerEnabled, questions, current, timer]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Favorites
  const toggleFavorite = (q: Question) => {
    const stored: Question[] = JSON.parse(localStorage.getItem("favorites") || "[]");
    const exists = stored.find((item) => item.id === q.id);

    let updated: Question[];
    if (exists) updated = stored.filter((item) => item.id !== q.id);
    else updated = [...stored, q];

    setFavorites(updated.map((item) => item.id));
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (loading)
    return (
      <p className="text-center pt-32 text-lg animate-pulse text-white/70">
        Loading questions...
      </p>
    );

  if (showResult)
    return (
      <div className="text-center pt-20 space-y-6">
        <h2 className="text-4xl font-extrabold">Quiz Completed!</h2>
        <p className="text-lg">
          Your Score: <strong>{score}</strong> / {questions.length}
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate(`/quiz/${id}`)}>Play Again</Button>
          <Button variant="outline" onClick={() => navigate("/categories")}>
            Back to Categories
          </Button>
        </div>
      </div>
    );

  const q = questions[current];
  const isFav = favorites.includes(q.id);

  return (
    <div className="w-full flex justify-center px-4 pt-20 pb-20">
      <div className="w-full max-w-3xl space-y-8">
        <h2 className="text-4xl font-extrabold text-center">
          Quiz: {q.category}
        </h2>

        {timerEnabled && (
          <div className="absolute top-6 right-6 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg">
            {timer}s
          </div>
        )}

        <Card className="p-6 shadow-2xl bg-gray-900/80 border border-white/10 rounded-xl">
          <CardHeader className="flex justify-between items-start">
            <CardTitle
              className="text-xl font-semibold text-white max-w-[85%]"
              dangerouslySetInnerHTML={{ __html: q.question }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavorite(q)}
              className={isFav ? "text-yellow-400" : "text-gray-400"}
            >
              <Star />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4 mt-4">
            {shuffledOptions.map((opt) => (
              <Button
                key={opt}
                onClick={() => handleAnswer(opt)}
                disabled={!!selected}
                variant={
                  selected
                    ? opt === q.correct_answer
                      ? "default"
                      : opt === selected
                      ? "destructive"
                      : "outline"
                    : "outline"
                }
                className="w-full py-3 text-left"
                dangerouslySetInnerHTML={{ __html: opt }}
              />
            ))}
          </CardContent>

          <Separator className="my-4" />

          <div className="flex justify-between text-white">
            <p>
              Question {current + 1} / {questions.length}
            </p>

            <Button disabled={!selected} onClick={handleNext}>
              {current + 1 === questions.length ? "Finish" : "Next"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizPage;
