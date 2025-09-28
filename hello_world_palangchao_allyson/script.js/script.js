function showMessage() {
    const email = document.getElementById("emailInput").value;
    const birthDate = document.getElementById("birthDate").value;

    if (email && birthDate) {
        alert("Hello Allyson! You entered:\nEmail: " + email + "\nBirthday: " + birthDate);
    } else {
        alert("Please fill in all fields before submitting.");
    }
}
