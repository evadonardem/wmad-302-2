// Create your BMI calculator here using JavaScript
document.getElementById("bmiForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let height = parseFloat(document.getElementById("height").value) / 100; // convert to meters
  let weight = parseFloat(document.getElementById("weight").value);

  if (height > 0 && weight > 0) {
    let bmi = (weight / (height * height)).toFixed(2);
    document.getElementById("result").textContent = `Your BMI is: ${bmi}`;

    let category = "";
    if (bmi < 18.5) {
      category = "Underweight 😟";
    } else if (bmi < 24.9) {
      category = "Normal weight 🙂";
    } else if (bmi < 29.9) {
      category = "Overweight 😐";
    } else {
      category = "Obesity 😮";
    }

    document.getElementById("category").textContent = `Category: ${category}`;
  } else {
    document.getElementById("result").textContent = "Please enter valid numbers.";
    document.getElementById("category").textContent = "";
  }
});
