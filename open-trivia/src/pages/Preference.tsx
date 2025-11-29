import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const DEFAULTS = {
  numQuestions: 10,
  difficulty: "any",
  shuffleAnswers: true,
  timerEnabled: false,
  timerDuration: 20,
  theme: "system",
};

type ThemeOption = "light" | "dark" | "system";
type Difficulty = "any" | "easy" | "medium" | "hard";

function readBool(key: string, fallback: boolean) {
  const v = localStorage.getItem(key);
  return v === null ? fallback : v === "true";
}

function readNumber(key: string, fallback: number) {
  const v = localStorage.getItem(key);
  const n = Number(v);
  return v === null || !Number.isFinite(n) ? fallback : n;
}

export default function Preferences() {
  const [numQuestions, setNumQuestions] = useState<number>(
    readNumber("otq_numQuestions", DEFAULTS.numQuestions)
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(
    (localStorage.getItem("otq_difficulty") as Difficulty) || DEFAULTS.difficulty
  );
  const [shuffleAnswers, setShuffleAnswers] = useState<boolean>(
    readBool("otq_shuffleAnswers", DEFAULTS.shuffleAnswers)
  );
  const [timerEnabled, setTimerEnabled] = useState<boolean>(
    readBool("otq_timerEnabled", DEFAULTS.timerEnabled)
  );
  const [timerDuration, setTimerDuration] = useState<number>(
    readNumber("otq_timerDuration", DEFAULTS.timerDuration)
  );
  const [theme, setTheme] = useState<ThemeOption>(
    (localStorage.getItem("otq_theme") as ThemeOption) || DEFAULTS.theme
  );

  // Save preferences
  useEffect(() => localStorage.setItem("otq_numQuestions", String(numQuestions)), [numQuestions]);
  useEffect(() => localStorage.setItem("otq_difficulty", difficulty), [difficulty]);
  useEffect(() => localStorage.setItem("otq_shuffleAnswers", String(shuffleAnswers)), [shuffleAnswers]);
  useEffect(() => localStorage.setItem("otq_timerEnabled", String(timerEnabled)), [timerEnabled]);
  useEffect(() => localStorage.setItem("otq_timerDuration", String(timerDuration)), [timerDuration]);
  useEffect(() => { localStorage.setItem("otq_theme", theme); applyTheme(theme); }, [theme]);

  function applyTheme(value: ThemeOption) {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.removeAttribute("data-theme");

    if (value === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(prefersDark ? "dark" : "light");
      return;
    }

    root.classList.add(value);
    root.setAttribute("data-theme", value);
  }

  function clearFavorites() {
    localStorage.removeItem("favorites");
    alert("Favorites cleared.");
  }

  function resetPreferences() {
    Object.keys(DEFAULTS).forEach((key) =>
      localStorage.removeItem(`otq_${key}`)
    );

    setNumQuestions(DEFAULTS.numQuestions);
    setDifficulty(DEFAULTS.difficulty as Difficulty);
    setShuffleAnswers(DEFAULTS.shuffleAnswers);
    setTimerEnabled(DEFAULTS.timerEnabled);
    setTimerDuration(DEFAULTS.timerDuration);
    setTheme(DEFAULTS.theme as ThemeOption);

    applyTheme(DEFAULTS.theme as ThemeOption);

    alert("Preferences reset to defaults.");
  }

  function resetEntireApp() {
    if (confirm("This will clear ALL app data (favorites, preferences). Proceed?")) {
      localStorage.clear();
      window.location.reload();
    }
  }

  useEffect(() => {
    applyTheme(theme);
  }, []);

  const selectClass =
    "mt-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-8">
      <h1 className="text-3xl font-bold">Preferences</h1>
      <p className="text-muted-foreground">Change your quiz behavior and app theme.</p>
      <Separator />

      {/* QUIZ SETTINGS */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">

            {/* Number of questions */}
            <label className="flex flex-col">
              <span className="text-sm font-medium">Number of questions</span>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className={selectClass}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
              <span className="text-xs text-muted-foreground mt-1">
                Default number used when starting a quiz.
              </span>
            </label>

            {/* Difficulty */}
            <label className="flex flex-col">
              <span className="text-sm font-medium">Difficulty</span>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className={selectClass}
              >
                <option value="any">Any</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <span className="text-xs text-muted-foreground mt-1">
                Choose the default difficulty for quizzes.
              </span>
            </label>

            {/* Shuffle */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <span className="text-sm font-medium">Shuffle answer options</span>
                <div className="mt-2">
                  <Switch
                    checked={shuffleAnswers}
                    onCheckedChange={(v) => setShuffleAnswers(Boolean(v))}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  If enabled, answer choices will be randomized.
                </p>
              </div>
            </div>

            {/* Timer + Duration */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <span className="text-sm font-medium">Enable timer</span>
                <div className="mt-2">
                  <Switch
                    checked={timerEnabled}
                    onCheckedChange={(v) => setTimerEnabled(Boolean(v))}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Turn on a countdown timer for each question.
                </p>
              </div>

              <label className="flex flex-col">
                <span className="text-sm font-medium">Timer duration (seconds)</span>
                <select
                  value={timerDuration}
                  onChange={(e) => setTimerDuration(Number(e.target.value))}
                  disabled={!timerEnabled}
                  className={selectClass}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
                <span className="text-xs text-muted-foreground mt-1">
                  Time per question when timer is enabled.
                </span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UI SETTINGS */}
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex flex-col">
            <span className="text-sm font-medium">Theme</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as ThemeOption)}
              className={selectClass}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <span className="text-xs text-muted-foreground mt-1">
              Choose your app’s theme.
            </span>
          </label>
        </CardContent>
      </Card>

      {/* DATA MANAGEMENT */}
      <Card>
        <CardHeader>
          <CardTitle>Data & Storage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Clear favorites */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Clear Favorites</div>
              <div className="text-xs text-muted-foreground">
                Remove all saved favorite questions.
              </div>
              <Button variant="destructive" onClick={clearFavorites}>
                Clear Favorites
              </Button>
            </div>

            {/* Reset preferences */}
            <div className="space-y-2">
              <div className="text-sm font-medium">Reset Preferences</div>
              <div className="text-xs text-muted-foreground">
                Restore all preferences to defaults.
              </div>
              <Button variant="outline" onClick={resetPreferences}>
                Reset Preferences
              </Button>
            </div>

            {/* Reset all */}
            <div className="sm:col-span-2 space-y-2">
              <div className="text-sm font-medium">Reset Entire App</div>
              <div className="text-xs text-muted-foreground">
                Clear all browser-stored data.
              </div>
              <Button variant="destructive" onClick={resetEntireApp}>
                Reset Entire App
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ABOUT */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">Open Trivia — WMAD-302</p>
          <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          <p className="mt-2 text-sm">
            This app fetches questions from the Open Trivia DB. Preferences are stored locally.
          </p>

          <div className="flex gap-3 mt-4">
            <Button onClick={() => navigator.clipboard?.writeText("Open Trivia — WMAD-302")}>
              Copy App Info
            </Button>
            <Button variant="outline">Credits</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
