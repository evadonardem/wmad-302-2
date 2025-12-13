import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("9");
  const [difficulty, setDifficulty] = useState("easy");
  const [amount, setAmount] = useState(5);
  const [type, setType] = useState("multiple");
  const [timer, setTimer] = useState("");
  const [isDark, setIsDark] = useState(false);

  // LOAD THEME FROM PREFERENCES
  useEffect(() => {
    const theme = localStorage.getItem("pref_theme") || "light";

    const darkModeEnabled =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    setIsDark(darkModeEnabled);

    // APPLY GLOBAL DARK MODE TO BODY
    if (darkModeEnabled) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  const startQuiz = () => {
    if (amount < 1) return alert("Amount must be at least 1");
    if (timer && timer < 5) return alert("Timer must be at least 5 seconds");

    const timerValue = timer ? `&timer=${timer}` : "";

    navigate(
      `/questions?amount=${amount}&difficulty=${difficulty}&category=${category}&type=${type}${timerValue}`
    );
  };

  return (
    <div style={pageStyle(isDark)}>
      <div style={cardStyle(isDark)}>
        <h1 style={titleStyle(isDark)}>🎯 Quiz Setup</h1>

        <label style={labelStyle(isDark)}>Number of Questions</label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle(isDark)}
        />

        <label style={labelStyle(isDark)}>Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={inputStyle(isDark)}
        >
          <option value="easy">Easy 🟢</option>
          <option value="medium">Medium 🟡</option>
          <option value="hard">Hard 🔴</option>
        </select>

        <label style={labelStyle(isDark)}>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle(isDark)}
        >
          <option value="9">General Knowledge</option>
          <option value="10">Entertainment: Books</option>
          <option value="11">Entertainment: Film</option>
          <option value="12">Music</option>
          <option value="17">Science & Nature</option>
          <option value="21">Sports</option>
          <option value="23">History</option>
        </select>

        <label style={labelStyle(isDark)}>Quiz Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={inputStyle(isDark)}
        >
          <option value="multiple">Multiple Choice</option>
          <option value="boolean">True / False</option>
          <option value="">Any</option>
        </select>

        <label style={labelStyle(isDark)}>Timer per Quiz (seconds)</label>
        <input
          type="number"
          min="5"
          placeholder="Leave blank for no timer"
          value={timer}
          onChange={(e) => setTimer(e.target.value)}
          style={inputStyle(isDark)}
        />

        <button
          onClick={startQuiz}
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
        >
          🚀 Start Quiz
        </button>
      </div>
    </div>
  );
};

// ---------------- STYLES ----------------

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
  boxSizing: "border-box"
});

const cardStyle = (dark) => ({
  width: "100%",
  maxWidth: "380px",
  background: dark ? "#020617" : "#fff",
  color: dark ? "#fff" : "#000",
  borderRadius: "18px",
  padding: "25px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)"
});

const titleStyle = (dark) => ({
  textAlign: "center",
  marginBottom: "20px",
  fontSize: "24px",
  fontWeight: "bold",
  color: dark ? "#f8fafc" : "#000"
});

const labelStyle = (dark) => ({
  fontSize: "14px",
  fontWeight: "bold",
  marginTop: "12px",
  display: "block",
  color: dark ? "#e5e7eb" : "#000"
});

const inputStyle = (dark) => ({
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  borderRadius: "10px",
  border: dark ? "1px solid #334155" : "1px solid #ddd",
  fontSize: "14px",
  outline: "none",
  background: dark ? "#020617" : "#fff",
  color: dark ? "#fff" : "#000"
});

const buttonStyle = {
  marginTop: "20px",
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg,#4facfe,#00f2fe)",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "transform 0.2s ease",
  boxShadow: "0 5px 20px rgba(0,0,0,0.2)"
};

export default Categories;
