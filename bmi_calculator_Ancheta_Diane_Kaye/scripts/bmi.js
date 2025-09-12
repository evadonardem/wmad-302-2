document.getElementById("calculateBtn").addEventListener("click", function () {
    const height = parseFloat(document.getElementById("Hayt").value);
    const weight = parseFloat(document.getElementById("Kilogram").value);
    const resultDiv = document.getElementById("bmiResult");
    const bmiValueH3 = document.getElementById("bmiValue");
    const bmiCategoryH5 = document.getElementById("bmiCategory");

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert("Please enter valid positive numbers for height and weight.");
        return;
    }

    const bmi = weight / (height * height);
    let category = "";
    let textColor = "";

    if (bmi < 18.5) {
        category = "Underweight";
        textColor = "text-warning";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = "Normal Weight";
        textColor = "text-success";
    } else if (bmi >= 25 && bmi < 29.9) {
        category = "Overweight";
        textColor = "text-warning";
    } else {
        category = "Obese";
        textColor = "text-danger";
    }

    // Reset result classes
    resultDiv.className = "mt-4 p-3 border rounded text-center justify-content-center";

    // Display result
    bmiValueH3.textContent = `BMI: ${bmi.toFixed(2)}`;
    bmiCategoryH5.textContent = `Category: ${category}`;
    bmiCategoryH5.className = `mb-0 fw-medium ${textColor}`;
    resultDiv.classList.remove("d-none");
});
