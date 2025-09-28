function calculateBMI() {
    let weight = document.getElementById("weight").value;
    let height = document.getElementById("height").value;

    if (weight === "" || height === "" || weight <= 0 || height <= 0) {
        document.getElementById("result").innerHTML = "<p class='text-danger'>⚠ Please enter valid weight and height!</p>";
        return;
    }

    height = height / 100; // convert cm to meters
    let bmi = (weight / (height * height)).toFixed(1);

    let message = "";
    let icon = "";
    let colorClass = "";

    if (bmi < 18.5) {
        message = "Underweight";
        icon = "<i class='fas fa-weight-scale'></i>";
        colorClass = "text-warning"; 
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        message = "Normal (Healthy)";
        icon = "<i class='fas fa-heart-circle-check'></i>";
        colorClass = "text-success"; 
    } else if (bmi >= 25 && bmi <= 29.9) {
        message = "Overweight";
        icon = "<i class='fas fa-circle-exclamation'></i>";
        colorClass = "text-orange"; 
    } else {
        message = "Obese";
        icon = "<i class='fas fa-triangle-exclamation'></i>";
        colorClass = "text-danger"; 
    }

    document.getElementById("result").innerHTML = `
        <h4 class="${colorClass}">${icon} Your BMI is ${bmi} (${message})</h4>
    `;
}
