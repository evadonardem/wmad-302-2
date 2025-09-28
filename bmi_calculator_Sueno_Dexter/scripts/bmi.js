document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("bmiForm");
  const bmiResult = document.getElementById("bmiResult");
  const bmiCategory = document.getElementById("bmiCategory");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const weight = parseFloat(document.getElementById("weight").value);
    const heightM = parseFloat(document.getElementById("height").value);

    if (weight > 0 && heightM > 0) {
      const bmi = weight / (heightM * heightM);

      bmiResult.textContent = `Your BMI: ${bmi.toFixed(2)}`;

      let category = "";
      let icon = "";

      if (bmi < 18.5) {
        category = "Underweight";
        icon = '<i class="fa-solid fa-dog text-warning"></i>';
        bmiResult.className = "fw-bold text-warning";
      } else if (bmi < 24.9) {
        category = "Normal";
        icon = '<i class="fa-brands fa-wolf-pack-battalion text-success"></i>';
        bmiResult.className = "fw-bold text-success";
      } else if (bmi < 29.9) {
        category = "Overweight";
        icon = '<i class="fa-solid fa-republican text-warning"></i>';
        bmiResult.className = "fw-bold text-warning";
      } else {
        category = "Obese";
        icon = '<i class="fa-solid fa-globe text-danger"></i>';
        bmiResult.className = "fw-bold text-danger";
      }

      bmiCategory.innerHTML = `${icon} ${category}`;
    } else {
      bmiResult.textContent = "Please enter valid numbers.";
      bmiResult.className = "fw-bold text-danger";
      bmiCategory.textContent = "";
    }
  });
});
