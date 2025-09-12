 document.getElementById('bmiForm').addEventListener('submit', function(event) {
            event.preventDefault();

            // Get weight and height input values
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value);

            // Check if the input values are valid
            if (isNaN(weight) || isNaN(height) || height <= 0) {
                alert('Please enter valid values for weight and height.');
                return;
            }

            // Calculate BMI: weight (kg) / height^2 (m^2)
            const bmi = weight / (height * height);

            // Show the result
            const result = document.getElementById('result');
            const bmiValue = document.getElementById('bmiValue');
            result.classList.remove('d-none'); // Make result visible

            bmiValue.textContent = `Your BMI is ${bmi.toFixed(2)}`;

            // Add color based on BMI value
            if (bmi < 18.5) {
                bmiValue.textContent += ' (Underweight)';
                result.classList.add('bg-warning', 'text-dark'); // Yellow background
                result.classList.remove('bg-success', 'bg-danger');
            } else if (bmi >= 18.5 && bmi < 24.9) {
                bmiValue.textContent += ' (Normal weight)';
                result.classList.add('bg-success', 'text-white'); // Green background
                result.classList.remove('bg-warning', 'bg-danger');
            } else if (bmi >= 25 && bmi < 29.9) {
                bmiValue.textContent += ' (Overweight)';
                result.classList.add('bg-danger', 'text-white'); // Red background
                result.classList.remove('bg-warning', 'bg-success');
            } else {
                bmiValue.textContent += ' (Obesity)';
                result.classList.add('bg-danger', 'text-white'); // Red background
                result.classList.remove('bg-warning', 'bg-success');
            }
        });