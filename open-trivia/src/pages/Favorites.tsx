import { useEffect, useState } from "react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isDark, setIsDark] = useState(false);

  // Load theme from preferences (SAME AS CATEGORIES)
  useEffect(() => {
    const theme = localStorage.getItem("pref_theme") || "light";

    if (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  // Load favorites
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(saved);
  }, []);

  if (!favorites.length) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "60px",
          color: isDark ? "#fff" : "#000",
        }}
      >
        No favorites yet
      </h2>
    );
  }

  return (
    <div style={pageStyle(isDark)}>
      <div style={cardStyle(isDark)}>

        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: isDark ? "#fff" : "#000",
          }}
        >
          ⭐ Favorites
        </h1>

        {favorites.map((q, idx) => (
          <div key={idx} style={{ marginBottom: "20px" }}>
            <h3
              style={{ color: isDark ? "#e5e7eb" : "#000" }}
              dangerouslySetInnerHTML={{ __html: q.question }}
            />

            <ul style={{ listStyle: "none", padding: 0 }}>
              {[...q.incorrect_answers, q.correct_answer].map((a, i) => {
                const correct = a === q.correct_answer;

                return (
                  <li
                    key={i}
                    style={answerStyle(correct, isDark)}
                    dangerouslySetInnerHTML={{ __html: a }}
                  />
                );
              })}
            </ul>
          </div>
        ))}

      </div>
    </div>
  );
};

// ---------------- STYLES ----------------

// SAME PAGE BACKGROUND AS CATEGORIES
const pageStyle = (dark) => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: dark
    ? "linear-gradient(135deg, #020617, #0f172a)"
    : "linear-gradient(135deg, #667eea, #fff)",
  padding: "20px",
  boxSizing: "border-box",
});

const cardStyle = (dark) => ({
  background: dark ? "#020617" : "#fff",
  color: dark ? "#fff" : "#000",
  width: "100%",
  maxWidth: "600px",
  padding: "25px",
  borderRadius: "18px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
});

const answerStyle = (correct, dark) => ({
  padding: "6px 10px",
  margin: "5px 0",
  borderRadius: "8px",
  background: correct
    ? "#22c55e"
    : dark
    ? "#020617"
    : "#ddd",
  color: correct ? "#fff" : dark ? "#e5e7eb" : "#000",
  border: dark && !correct ? "1px solid #334155" : "none",
});

export default Favorites;
