document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.querySelector('.btn-primary');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const modalBody = document.querySelector('#bmiResultModal .modal-body');
    const myModal = new bootstrap.Modal(document.getElementById('bmiResultModal'));

    calculateBtn.addEventListener('click', function() {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        // Input validation
        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            alert("Please enter valid positive numbers for height and weight.");
            return;
        }

        // BMI calculation: weight (kg) / [height (m)]^2
        const bmi = (weight / Math.pow(height, 2)).toFixed(2);

        let category = '';
        let color = '';

        if (bmi < 18.5) {
            category = 'Underweight 😒';
            color = '#ffc107'; // yellow
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            category = 'Normal Weight 😍';
            color = '#28a745'; // green
        } else if (bmi >= 25 && bmi <= 29.9) {
            category = 'Overweight 😮';
            color = '#fd7e14'; // orange
        } else {
            category = 'Obese 😱';
            color = '#dc3545'; // red
        }

        // Update the modal's content
        modalBody.innerHTML = `
            <h4 class="mb-2">Your BMI is: <span style="color: ${color};">${bmi}</span></h4>
            <p class="lead" style="color: ${color}; font-weight: 500;">${category}</p>
        `;

        // Show the modal
        myModal.show();
    });
});