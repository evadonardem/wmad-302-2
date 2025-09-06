const form = document.getElementById("bmiForm");
const results = document.getElementById("results");
const bmiValue = document.getElementById("bmiValue");
const bmiCategory = document.getElementById("bmiCategory");
const advice = document.getElementById("advice");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const heightCm = parseFloat(document.getElementById("height").value);
  const weightKg = parseFloat(document.getElementById("weight").value);

  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    alert("⚠️ Please enter a valid height (cm) and weight (kg).");
    return;
  }

  const heightM = heightCm / 100; // convert cm → meters
  const bmi = weightKg / (heightM * heightM);
  const bmiRounded = bmi.toFixed(1);

  let category = "";
  let tip = "";
  let categoryClass = "";

  if (bmi < 18.5) {
    category = "Underweight";
    tip = "⚠️ Your BMI is below the healthy range. Consider consulting a nutritionist.";
    categoryClass = "text-underweight";
  } else if (bmi < 25) {
    category = "Normal";
    tip = "✅ Your BMI is in the healthy range. Keep it up!";
    categoryClass = "text-normal";
  } else if (bmi < 30) {
    category = "Overweight";
    tip = "⚠️ Your BMI is above the normal range. Consider more activity and balanced meals.";
    categoryClass = "text-overweight";
  } else {
    category = "Obese";
    tip = "❌ Your BMI is high. Please consult a healthcare provider for guidance.";
    categoryClass = "text-obese";
  }

  // Show results
  results.classList.remove("d-none");

  // Apply styles and values
  bmiValue.textContent = `${bmiRounded} kg/m²`;
  bmiValue.className = "fw-bold " + categoryClass;

  bmiCategory.textContent = category;
  bmiCategory.className = "fw-bold " + categoryClass;

  advice.textContent = tip;
});

form.addEventListener("reset", function () {
  results.classList.add("d-none");
  bmiValue.textContent = "—";
  bmiCategory.textContent = "—";
  advice.textContent = "—";
  bmiValue.className = "fw-bold";
  bmiCategory.className = "fw-bold";
});
// MATRIX BINARY BACKGROUND
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const binary = "01";
const fontSize = 16;
const columns = canvas.width / fontSize;

// Array for drops
const drops = [];
for (let x = 0; x < columns; x++) {
  drops[x] = 1;
}

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; // background fade
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Neon green
  ctx.fillStyle = "#39ff14";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = binary.charAt(Math.floor(Math.random() * binary.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 35);

// Handle resizing
window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});