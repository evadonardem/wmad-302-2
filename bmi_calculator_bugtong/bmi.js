// Create your BMI calculator here using JavaScript
// Create your BMI calculator here using JavaScript

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bmiForm');
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

     
        resultDiv.style.display = 'none';
        loadingDiv.style.display = 'block';

    
        setTimeout(() => {
            const weight = parseFloat(weightInput.value);
            const height = parseFloat(heightInput.value);

          
            if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
                alert("Please enter valid weight and height values.");
                loadingDiv.style.display = 'none'; 
                return;
            }

          
            const bmi = (weight / (height * height)).toFixed(2);

        
            let category;
            if (bmi < 18.5) {
                category = "Underweight";
                color = "blue";
            } else if (bmi < 24.9) {
                category = "Normal weight";
                color = "green";
            } else if (bmi < 29.9) {
                category = "Overweight";
                color = "orange";
            } else {
                category = "Obesity";
                color = "red";
            }

         
            resultDiv.innerHTML = `
                <div class="alert alert-info" role="alert" style="color:#C71585; border-color:#C71585; font-weight:bold;">
                    Your BMI is <strong>${bmi}</strong>, which is considered <strong>${category}</strong>.
                </div>
            `;

            loadingDiv.style.display = 'none';
            resultDiv.style.display = 'block';
        }, 1000);
    });
});
