// Create your BMI calculator here using JavaScript
document.getElementById("bmiForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let weight = parseFloat(document.getElementById("weight").value);
  let height = parseFloat(document.getElementById("height").value);

  if (weight > 0 && height > 0) {
    // Convert cm → m if needed
    if (height > 10) height = height / 100;

    // BMI formula
    let bmi = weight / (height * height);
    let category = "";
    let colorClass = "";
    let icon = "";

    if (bmi < 18.5) {
      category = "Underweight";
      colorClass = "alert-warning"; 
      icon = '<i class="fas fa-weight-scale"></i>';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = "Normal weight";
      colorClass = "alert-success";
      icon = '<i class="fas fa-check-circle"></i>'; 
    } else if (bmi >= 25 && bmi <= 29.9) {
      category = "Overweight";
      colorClass = "alert-orange"; 
      icon = '<i class="fas fa-exclamation-circle"></i>'; 
    } else {
      category = "Obesity";
      colorClass = "alert-danger";
      icon = '<i class="fas fa-exclamation-triangle"></i>'; 
    }

    // Show result
    let resultDiv = document.getElementById("result");
    resultDiv.className = `alert text-center mt-3 ${colorClass}`;
    resultDiv.innerHTML = `
      ${icon} <br>
      <strong>BMI:</strong> ${bmi.toFixed(2)} <br> 
      <strong>Category:</strong> ${category}
    `;
  } else {
    alert("⚠️ Please enter valid numbers for weight and height!");
  }
});
