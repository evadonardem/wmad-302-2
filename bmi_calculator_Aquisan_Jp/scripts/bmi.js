// scripts/bmi.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bmiForm");
  const resultCard = document.getElementById("resultCard");
  const bmiValue = document.getElementById("bmiValue");
  const bmiCategory = document.getElementById("bmiCategory");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const weight = parseFloat(document.getElementById("weight").value);
    const heightCm = parseFloat(document.getElementById("height").value);

    if (isNaN(weight) || isNaN(heightCm) || weight <= 0 || heightCm <= 0) {
      alert("Please enter valid positive numbers for weight and height.");
      return;
    }

    const heightM = heightCm / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    let category = "";
    let colorClass = "";

    if (bmi < 18.5) {
      category = "Underweight";
      colorClass = "alert-warning"; // yellow
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Normal weight";
      colorClass = "alert-success"; // green
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
      colorClass = "alert-warning"; // orange 
    } else {
      category = "Obese";
      colorClass = "alert-danger"; // red
    }

    // Reset old classes
    resultCard.className = "mt-4"; 
    resultCard.classList.add("alert", "text-center", colorClass);

    // Show result
    bmiValue.textContent = `Your BMI: ${bmi}`;
    bmiCategory.textContent = `Category: ${category}`;
    resultCard.style.display = "block";
  });
});
