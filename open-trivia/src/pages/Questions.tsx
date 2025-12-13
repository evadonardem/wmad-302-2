import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Separator } from "../components/ui/separator";

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

const Questions = () => {
  const [params] = useSearchParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const [options, setOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);

  const isDark = document.body.classList.contains("dark");
  const navigate = useNavigate();

  const amount = params.get("amount");
  const difficulty = params.get("difficulty");
  const category = params.get("category");
  const type = params.get("type") || "multiple";
  const timer = params.get("timer");

  // Save favorites
  const addToFavorites = (question) => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (!saved.some((q) => q.question === question.question)) {
      saved.push(question);
      localStorage.setItem("favorites", JSON.stringify(saved));
    }
  };

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      const query = new URLSearchParams({
        amount,
        difficulty,
        category,
        type
      });

      try {
        const result = await axios.get(
          `https://opentdb.com/api.php?${query.toString()}`
        );
        setQuestions(result.data.results);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchQuestions();
  }, []);

  // Timer
  useEffect(() => {
    if (!timer || showResult) return;

    setTimeLeft(Number(timer));

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          finishQuiz();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [questions, showResult]);

  // Load question options
  useEffect(() => {
    if (!questions.length) return;

    const q = questions[index];
    const shuffled = [...q.incorrect_answers, q.correct_answer].sort(
      () => Math.random() - 0.5
    );
    setOptions(shuffled);
  }, [index, questions]);

  const handleAnswer = (opt) => {
    if (selected) return;

    setSelected(opt);

    if (opt === questions[index].correct_answer) {
      setScore((s) => s + 1);
    }

    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex(index + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }, 900);
  };

  const finishQuiz = () => setShowResult(true);

  if (loading)
    return (
      <h2 style={{ padding: "20px", color: isDark ? "#e2e8f0" : "#000" }}>
        Loading questions...
      </h2>
    );

  if (showResult) {
    return (
      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          color: isDark ? "#f1f5f9" : "#000"
        }}
      >
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          🎉 Quiz Finished!
        </h1>

        <h2 style={{ marginBottom: "20px" }}>
          Score: <strong>{score}</strong> / {questions.length}
        </h2>

        {timer && (
          <p style={{ marginBottom: "20px" }}>
            ⏳ Timer Mode: <strong>{timer} seconds</strong>
          </p>
        )}

        <Separator />

        <button
          onClick={() => navigate("/categories")}
          style={{
            marginTop: "25px",
            padding: "14px 20px",
            background: "#4A6CF7",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          🔁 Try Again
        </button>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div
      style={{
        padding: "30px 20px",
        maxWidth: "800px",
        margin: "auto",
        color: isDark ? "#e2e8f0" : "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
      }}
    >
      {/* TIMER */}
      {timer && (
        <div
          style={{
            padding: "10px",
            background:
              timeLeft <= 5
                ? "#ffb3b3"
                : isDark
                ? "#1e293b"
                : "#eef3ff",
            borderRadius: "10px",
            marginBottom: "25px",
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "600",
            color: isDark ? "#f1f5f9" : "#000"
          }}
        >
          ⏳ Time Left: {timeLeft}s
        </div>
      )}

      <h2 style={{ fontSize: "22px", marginBottom: "10px", opacity: 0.9 }}>
        Question {index + 1} / {questions.length}
      </h2>

      <h3
        style={{
          marginBottom: "25px",
          fontSize: "24px",
          fontWeight: "600",
          maxWidth: "700px",
          lineHeight: "1.4",
          color: isDark ? "#f8fafc" : "#222"
        }}
      >
        {decodeHTML(q.question)}
      </h3>

      <button
        onClick={() => addToFavorites(q)}
        style={{
          marginBottom: "25px",
          padding: "10px 15px",
          background: "#ffca28",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
          color: "#000"
        }}
      >
        ⭐ Add to Favorites
      </button>

      {/* ----- ANSWER OPTIONS WITH CORRECT/Wrong COLORS ----- */}
      {options.map((opt, i) => {
        const isCorrect = opt === q.correct_answer;
        const isSelected = selected === opt;

        let bgColor = isDark ? "#1e293b" : "#ffffff";

        if (selected) {
          if (isCorrect) bgColor = "#62d66a";
          if (isSelected && !isCorrect) bgColor = "#ff6b6b";
        }

        return (
          <div
            key={i}
            onClick={() => handleAnswer(opt)}
            style={{
              padding: "14px 20px",
              background: bgColor,
              color: isDark ? "#f1f5f9" : "#000",
              border: isDark ? "1px solid #334155" : "1px solid #ccc",
              borderRadius: "10px",
              marginBottom: "12px",
              fontSize: "16px",
              fontWeight: "500",
              width: "100%",
              maxWidth: "450px",
              cursor: selected ? "default" : "pointer",
              pointerEvents: selected ? "none" : "auto",
              transition: "0.2s"
            }}
          >
            {decodeHTML(opt)}
          </div>
        );
      })}

      <Separator />
    </div>
  );
};

export default Questions;
