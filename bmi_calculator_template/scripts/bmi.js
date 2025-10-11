function calculateBMI() {
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const resultBox = document.getElementById("resultBox");

    if (!height || !weight || height <= 0 || weight <= 0) {
        resultBox.innerHTML = "⚠️ Please enter valid numbers!";
        resultBox.style.background = "rgba(255,0,0,0.6)";
        resultBox.style.color = "#fff";
        return;
    }

    const bmi = weight / (height * height);
    let category = "";
    let color = "";

    if (bmi < 18.5) {
        category = "Underweight";
        color = "rgba(255,215,0,0.7)"; // Yellow
    } else if (bmi >= 18.5 && bmi < 25) {
        category = "Normal weight";
        color = "rgba(0,255,100,0.7)"; // Green
    } else if (bmi >= 25 && bmi < 30) {
        category = "Overweight";
        color = "rgba(255,215,0,0.7)"; // Yellow
    } else {
        category = "Obese";
        color = "rgba(255,0,0,0.7)"; // Red
    }

    resultBox.innerHTML = `Your BMI is <strong>${bmi.toFixed(2)}</strong> <br> Category: <strong>${category}</strong>`;
    resultBox.style.background = color;
    resultBox.style.color = "#000";
}