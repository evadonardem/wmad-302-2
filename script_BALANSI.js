// Dynamic Heading Update
const fullNameInput = document.getElementById('fullName');
const heading = document.querySelector('h1.display-4');

fullNameInput.addEventListener('input', function () {
    const name = fullNameInput.value.trim();
    heading.textContent = name ? `Hello World... ${name}` : 'Hello World... [Your Name]';
});

// Form Handling
const form = document.getElementById('helloForm');
const thankYouMsg = document.getElementById('thankYouMsg');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    thankYouMsg.classList.remove('d-none');
    thankYouMsg.textContent = 'Thank you for registering!';
    // Subtle animation
    thankYouMsg.style.opacity = 0;
    thankYouMsg.style.transition = 'opacity 0.7s';
    setTimeout(() => {
        thankYouMsg.style.opacity = 1;
    }, 50);
});
