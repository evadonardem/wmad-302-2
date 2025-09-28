// Create your BMI calculator here using JavaScript// Create your BMI calculator here using JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const resultDiv = document.getElementById('result');
    const form = document.getElementById('bmiForm');

    function getCategoryAndAlertClass(bmi) {
        if (bmi < 18.5) return { category: 'Underweight', alertClass: 'alert-info' };
        if (bmi < 25) return { category: 'Normal weight', alertClass: 'alert-success' };
        if (bmi < 30) return { category: 'Overweight', alertClass: 'alert-warning' };
        return { category: 'Obesity', alertClass: 'alert-danger' };
    }

    function validateInput(input) {
        const val = parseFloat(input.value);
        if (isNaN(val) || val <= 0) {
            input.classList.add('is-invalid');
            return null;
        } else {
            input.classList.remove('is-invalid');
            return val;
        }
    }

    function calculateBMI() {
        const weight = validateInput(weightInput);
        const heightCm = validateInput(heightInput);

        if (weight === null || heightCm === null) {
            resultDiv.innerHTML = '';
            return;
        }

        const heightM = heightCm / 100;
        const bmi = weight / (heightM * heightM);
        const bmiRounded = bmi.toFixed(2);

        const { category, alertClass } = getCategoryAndAlertClass(bmi);

        // Show result inside a Bootstrap alert box that pops out
        resultDiv.innerHTML = `
            <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
                <h4 class="alert-heading">Your BMI is ${bmiRounded}</h4>
                <p class="mb-0">Category: <strong>${category}</strong></p>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    weightInput.addEventListener('input', calculateBMI);
    heightInput.addEventListener('input', calculateBMI);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculateBMI();
    });
});
