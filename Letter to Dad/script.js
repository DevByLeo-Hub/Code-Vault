const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

const topTextElement = document.getElementById('top-text');
const mainTextElement = document.getElementById('main-text');


function startTyping(element, text, delay) {
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        
        span.textContent = char === ' ' ? '\u00A0' : char; 
        span.style.opacity = 0;
        span.style.transition = `opacity 0.5s ease, transform 0.5s ease`;
        span.style.transform = "translateY(10px)";
        element.appendChild(span);

        setTimeout(() => {
            span.style.opacity = 1;
            span.style.transform = "translateY(0)";
        }, index * delay);
    });
}

setTimeout(() => {
    startTyping(topTextElement, "MY FOREVER", 100);
    setTimeout(() => {
        startTyping(mainTextElement, "INSPIRATION", 150);
    }, 1200); 
}, 1000);


window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initStars(); 
});

const fireworks = [];
const particles = [];
let stars = [];
let backgroundShootingStars = [];

function initStars() {
    stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.5,
            alpha: Math.random(), fade: Math.random() * 0.03 + 0.01, direction: Math.random() > 0.5 ? 1 : -1 
        });
    }
}
initStars();

function drawStars() {
    stars.forEach(s => {
        s.alpha += s.fade * s.direction;
        if (s.alpha >= 1) { s.alpha = 1; s.direction = -1; } 
        else if (s.alpha <= 0.1) { s.alpha = 0.1; s.direction = 1; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fill();
    });
}

class ShootingStarBg {
    constructor() {
        this.side = Math.random() < 0.5 ? 'left' : 'right';
        this.x = this.side === 'left' ? -50 : w + 50;
        this.y = Math.random() * (h / 2);
        this.speedX = Math.random() * 20 + 25; 
        this.vx = this.side === 'left' ? this.speedX : -this.speedX;
        this.vy = -(Math.random() * 2 + 1); 
        this.curveGravity = 0.08; 
        this.opacity = 0.8; 
        this.trail = [];
    }
    update() {
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 3) this.trail.shift();
        this.vy += this.curveGravity; 
        this.x += this.vx; this.y += this.vy;
        this.opacity -= 0.03; 
    }
    draw() {
        if (this.opacity <= 0) return;
        ctx.beginPath();
        if (this.trail.length > 0) {
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(this.opacity, 0.6)})`;
        ctx.stroke();
    }
}

class Firework {
    constructor(targetX, targetY) {
        this.x = targetX; this.y = h; this.targetX = targetX; this.targetY = targetY; 
        this.speed = 6; 
        this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.trail = []; this.exploded = false;
    }
    update() {
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 12) this.trail.shift();
        this.x += this.vx; this.y += this.vy;
        if (this.vy < 0 && this.y <= this.targetY) {
            this.exploded = true;
            createParticles(this.targetX, this.targetY);
        }
    }
    draw() {
        ctx.beginPath();
        if (this.trail.length > 0) {
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'; 
        ctx.lineWidth = 2.5; ctx.stroke();
    }
}

class Particle {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.speed = Math.random() * 6 + 1; 
        this.angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.gravity = 0.06; this.friction = 0.93;
        this.alpha = 1; this.decay = Math.random() * 0.015 + 0.01;
        this.trail = []; 
        
        const colors = ['#003366', '#FFD700', '#FFFFFF', '#4DA6FF'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 8) this.trail.shift();
        this.vx *= this.friction; this.vy *= this.friction;
        this.vy += this.gravity; this.x += this.vx; this.y += this.vy;
        this.alpha -= this.decay;
    }
    draw() {
        ctx.save(); ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        if (this.trail.length > 0) {
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) ctx.lineTo(this.trail[i].x, this.trail[i].y);
        }
        ctx.strokeStyle = this.color; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2); 
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10; ctx.shadowColor = this.color; ctx.fill();
        ctx.restore();
    }
}

function createParticles(x, y) { for (let i = 0; i < 65; i++) particles.push(new Particle(x, y)); }

function launchFireworkSequence(x, y) {
    const numFireworks = 3 + Math.floor(Math.random() * 2); 
    for(let i = 0; i < numFireworks; i++) {
        setTimeout(() => {
            let offsetX = x + (Math.random() * 80 - 40);
            let offsetY = y + (Math.random() * 80 - 40);
            fireworks.push(new Firework(offsetX, offsetY));
        }, i * 500); 
    }
}

window.addEventListener('mousedown', (e) => { launchFireworkSequence(e.clientX, e.clientY); });
window.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    launchFireworkSequence(touch.clientX, touch.clientY);
});

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(5, 10, 20, 0.2)'; 
    ctx.fillRect(0, 0, w, h);
    drawStars();
    if (Math.random() < 0.008) backgroundShootingStars.push(new ShootingStarBg());
    for (let i = backgroundShootingStars.length - 1; i >= 0; i--) {
        backgroundShootingStars[i].update(); backgroundShootingStars[i].draw();
        if (backgroundShootingStars[i].opacity <= 0 || backgroundShootingStars[i].y > h + 100) backgroundShootingStars.splice(i, 1);
    }
    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update(); fireworks[i].draw();
        if (fireworks[i].exploded) fireworks.splice(i, 1);
    }
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(); particles[i].draw();
        if (particles[i].alpha <= 0) particles.splice(i, 1);
    }
}
animate();