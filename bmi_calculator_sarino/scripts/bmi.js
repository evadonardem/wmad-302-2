// Create your BMI calculator here using JavaScript
document.getElementById("bmiForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value) / 100; // cm to meters
  const resultBox = document.getElementById("result");

  if (weight > 0 && height > 0) {
    const bmi = (weight / (height * height)).toFixed(2);
    let category = "";
    let alertClass = "alert-info";
    let icon = "fa-circle-info";

    if (bmi < 18.5) {
      category = "Underweight";
      alertClass = "alert-warning text-dark";
      icon = "fa-solid fa-triangle-exclamation";
    } else if (bmi < 24.9) {
      category = "Normal weight";
      alertClass = "alert-success";
      icon = "fa-solid fa-check-circle";
    } else if (bmi < 29.9) {
      category = "Overweight";
      alertClass = "alert-primary";
      icon = "fa-solid fa-scale-unbalanced";
    } else {
      category = "Obesity";
      alertClass = "alert-danger";
      icon = "fa-solid fa-skull-crossbones";
    }

    resultBox.className = `alert ${alertClass} mt-4`;
    resultBox.innerHTML = `<i class="${icon}"></i> Your BMI is <strong>${bmi}</strong> (${category}).`;
    resultBox.classList.remove("d-none");
  } else {
    resultBox.className = "alert alert-danger mt-4";
    resultBox.innerHTML = `<i class="fa-solid fa-ban"></i> Please enter valid numbers!`;
    resultBox.classList.remove("d-none");
  }
});
