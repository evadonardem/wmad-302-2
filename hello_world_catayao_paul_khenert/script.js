// ===== Update heading dynamically =====
const nameInput = document.getElementById('name');
const heading = document.getElementById('name-placeholder');
nameInput.addEventListener('input', () => {
    heading.innerText = "Hello World... " + nameInput.value;
});

// ===== Show thank you message on form submit =====
const form = document.getElementById('registration-form');
const thankYouMessage = document.getElementById('thank-you-message');

form.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent actual submission
    thankYouMessage.style.display = 'block'; // show the message

    // Optional: scroll into view
    thankYouMessage.scrollIntoView({ behavior: "smooth" });
});

// ===== Canvas Rain =====
const canvas = document.getElementById('rain-canvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

class Raindrop {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * -H;
        this.length = 10 + Math.random() * 20;
        this.speed = 4 + Math.random() * 4;
        this.opacity = 0.2 + Math.random() * 0.5;
        this.color = `rgba(142, 241, 142, ${this.opacity})`; // soft green
    }
    fall() {
        this.y += this.speed;
        if (this.y > H) this.reset();
    }
    draw() {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
    }
}

const dropsCount = 200;
const drops = [];
for (let i = 0; i < dropsCount; i++) drops.push(new Raindrop());

function animate() {
    ctx.clearRect(0, 0, W, H);
    drops.forEach(drop => { drop.fall(); drop.draw(); });
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
});
