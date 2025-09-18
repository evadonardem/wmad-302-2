// Create your BMI calculator here using JavaScript
document.getElementById('bmi').onclick = function() {
    let weight = parseFloat(document.getElementById('weight').value);
    let height = parseFloat(document.getElementById('height').value);

    if (isNaN(weight) || isNaN(height) ) {
        alert('Please enter valid values for weight and height.');
        return;
    }

    let bmi = (weight / (height * height));

    let category;
    if (bmi < 18.5) {
        category = 'Underweight';
        categoryColor = '#FFFF00';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = 'Normal weight';
        categoryColor = '#00ff15ff';
    } else if (bmi >= 25 && bmi < 29.9) {
        category = 'Overweight';
        categoryColor = '#ff7b00ff';
    } else if (bmi < 1000){
        
        category = 'Obesity';
        categoryColor = '#ff0000ff';
    }

    document.getElementById('result').innerHTML = `
        <h4>Your BMI: ${bmi.toFixed(2)}</h4>
        <h5 style="color: ${categoryColor};">${category}</h5>
    `;
};
