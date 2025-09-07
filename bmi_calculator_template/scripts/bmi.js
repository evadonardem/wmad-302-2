// Create your BMI calculator here using JavaScript
function calculateBMI() {
let weight = parseFloat(document.getElementById("weight").value);
let height = parseFloat(document.getElementById("height").value) / 100; // Convert cm to meters
let result = document.getElementById("result");


if (weight > 0 && height > 0) {
let bmi = weight / (height * height);
let category = "";
let colorClass = "";

if (bmi < 18.5) {
      category = "Underweight";
      colorClass = "text-primary"; 
    } else if (bmi < 25) {
      category = "Normal";
      colorClass = "text-success";
    } else if (bmi < 30) {
      category = "Overweight";
      colorClass = "text-warning"; 
    } else {
      category = "Obese";
      colorClass = "text-danger"; 
    }

    result.className = `fw-bold text-center ${colorClass}`;
    result.textContent = `Your BMI is ${bmi.toFixed(1)} (${category})`;
} else {
result.textContent = "Please enter valid weight and height.";
}
}