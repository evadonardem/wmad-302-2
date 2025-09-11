function calculateBmi() {
    const weightInput = document.getElementById("weightInput").value;
    const heightInput = document.getElementById("heightInput").value;

    const weight = parseFloat(weightInput);
    const height = parseFloat(heightInput);

    // Validate input first
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        document.getElementById("output").innerHTML = `⚠️ Please enter valid height and weight values.`;
        document.getElementById("output2").innerHTML = "";
        return;
    }

    const bmi = weight / (height * height);

    document.getElementById("output").innerHTML = `Your BMI is <strong>${bmi.toFixed(2)}</strong>.`;

    if (bmi < 18.5) {
        document.getElementById("output2").innerHTML = `
            <div>You have a low BMI (Underweight).</div>
            <div class="mt-3">
                <i class="fa-solid fa-scale-unbalanced fa-4x" style="color: rgba(0, 247, 255, 1);"></i>
            </div>`;
    } 
    else if (bmi >= 18.5 && bmi <= 24.9) {
        document.getElementById("output2").innerHTML = `
            <div>Your BMI is in the normal range.</div>
            <div class="mt-3">
                <i class="fa-solid fa-scale-balanced fa-4x" style="color: rgba(21, 255, 0, 1);"></i>
            </div>`;
    } 
    else if (bmi >= 25 && bmi <= 29.9) {
        document.getElementById("output2").innerHTML = `
            <div>You are overweight. A high BMI is associated with health risks.</div>
            <div class="mt-3">
                <i class="fa-solid fa-scale-unbalanced fa-4x" style="color: rgba(255, 0, 0, 1);"></i>
            </div>`;
    } 
    else {
        document.getElementById("output2").innerHTML = `
            <div>Your BMI indicates obesity. Consider exercise and a healthy lifestyle.</div>
            <div class="mt-3">
                <i class="fa-solid fa-scale-unbalanced fa-4x" style="color: #ff00aeff;"></i>
            </div>`;
    }
}

function clearInputs() {
    document.getElementById("weightInput").value = "";
    document.getElementById("heightInput").value = "";
    document.getElementById("output").innerHTML = "";
    document.getElementById("output2").innerHTML = "";
}