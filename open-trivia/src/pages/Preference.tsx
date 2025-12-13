import { useState, useEffect } from "react";

const Preferences = () => {
  const [theme, setTheme] = useState("light");
  const [defaultTimer, setDefaultTimer] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Load preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem("pref_theme") || "light";
    setTheme(savedTheme);
    setDefaultTimer(JSON.parse(localStorage.getItem("pref_timer") ?? "false"));

    if (
      savedTheme === "dark" ||
      (savedTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  // Apply theme when changed
  useEffect(() => {
    localStorage.setItem("pref_theme", theme);

    if (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, [theme]);

  const updateTheme = (value) => {
    setTheme(value);
  };

  const updateTimer = () => {
    const newVal = !defaultTimer;
    setDefaultTimer(newVal);
    localStorage.setItem("pref_timer", JSON.stringify(newVal));
  };

  const clearFavorites = () => {
    localStorage.removeItem("favorites");
    alert("Favorites cleared!");
  };

  const resetAll = () => {
    localStorage.clear();
    alert("All preferences reset!");
    window.location.reload();
  };

  return (
    <div style={pageStyle(isDark)}>
      <div style={cardStyle(isDark)}>
        <h1 style={{ fontSize: "28px", fontWeight: "600", marginBottom: "25px" }}>
          Preferences
        </h1>

        {/* THEME */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ marginBottom: "8px" }}>Theme</h2>
          <select
            value={theme}
            onChange={(e) => updateTheme(e.target.value)}
            style={selectStyle(isDark)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* TIMER */}
        <div style={rowStyle}>
          <h2>Enable Timer by Default</h2>
          <button onClick={updateTimer} style={btn(defaultTimer)}>
            {defaultTimer ? "Enabled" : "Disabled"}
          </button>
        </div>

        <hr style={divider(isDark)} />

        {/* CLEAR FAVORITES */}
        <button style={yellowBtn} onClick={clearFavorites}>
          Clear Favorites
        </button>

        
      </div>
    </div>
  );
};

// -------- STYLES (MATCHES FAVORITES) --------

const pageStyle = (dark) => ({
  position: "fixed",
  inset: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: dark
    ? "linear-gradient(135deg, #020617, #0f172a)"
    : "linear-gradient(135deg, #667eea, #fff)",
  padding: "20px",
});

const cardStyle = (dark) => ({
  background: dark ? "#020617" : "#ffffff",
  color: dark ? "#ffffff" : "#000000",
  width: "100%",
  maxWidth: "500px",
  padding: "25px",
  borderRadius: "18px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
});

const selectStyle = (dark) => ({
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: dark ? "1px solid #334155" : "1px solid #ccc",
  background: dark ? "#020617" : "#ffffff",
  color: dark ? "#ffffff" : "#000000",
});

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
};

const btn = (on) => ({
  padding: "6px 14px",
  borderRadius: "8px",
  background: on ? "#22c55e" : "#ef4444",
  color: "white",
  border: "none",
  cursor: "pointer",
});

const divider = (dark) => ({
  border: "none",
  height: "1px",
  background: dark ? "#334155" : "#ccc",
  marginBottom: "20px",
});

const yellowBtn = {
  width: "100%",
  padding: "10px",
  background: "#f59e0b",
  border: "none",
  borderRadius: "8px",
  color: "white",
  marginBottom: "10px",
};

const redBtn = {
  width: "100%",
  padding: "10px",
  background: "#dc2626",
  border: "none",
  borderRadius: "8px",
  color: "white",
};

export default Preferences;
