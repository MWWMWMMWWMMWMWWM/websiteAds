console.log("🔄 Holographic System Initializing...");

// --------------------
// CONFIG
// --------------------
const API_BASE = "https://websiteadsbackend.onrender.com";
const TRANSMISSION_TIMEOUT = 30000; // 30 seconds

// --------------------
// DOM references
// --------------------
const textarea = document.getElementById("surveyInput");
const counter = document.getElementById("charCounter");
const button = document.getElementById("submitBtn");
const holoCard = document.querySelector(".holo-card");

// --------------------
// Limits
// --------------------
const MAX_CHARS = 2000;
const MIN_TIME_BETWEEN_SUBMITS = 3_000;
const WINDOW_TIME = 5 * 60_000;
const MAX_CHARS_PER_WINDOW = 4000;

// --------------------
// State
// --------------------
let lastSubmitTime = 0;
let sentInWindow = 0;
let windowStart = Date.now();
let isSubmitting = false;
let transmissionTimeout = null;
let transmissionStartTime = null;

// --------------------
// HOLOGRAPHIC EFFECTS
// --------------------

// Dynamic scanline intensity based on mouse movement
document.addEventListener("mousemove", (e) => {
    const rect = holoCard?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left) / rect.width;
    const intensity = Math.max(0.1, 0.3 + (1 - Math.abs(x - 0.5) * 2) * 0.2);
    holoCard.style.setProperty('--scanline-opacity', intensity);
});

// Typing particle effect
const particles = [];
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.pointerEvents = 'none';
canvas.style.zIndex = '9999';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 4;
        this.speedY = (Math.random() - 0.5) * 4 - 2;
        this.life = 1;
        this.decay = 0.01 + Math.random() * 0.02;
        this.color = `hsl(${190 + Math.random() * 30}, 100%, ${60 + Math.random() * 30}%)`;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.05;
        this.life -= this.decay;
        this.size *= 0.99;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life * 0.8;
        ctx.shadowColor = 'rgba(0, 180, 255, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function createTypingParticles(x, y) {
    for (let i = 0; i < 5; i++) {
        particles.push(new Particle(x, y));
    }
}

textarea?.addEventListener('keydown', () => {
    const rect = textarea.getBoundingClientRect();
    const x = rect.left + Math.random() * rect.width;
    const y = rect.top + Math.random() * rect.height;
    createTypingParticles(x, y);
});

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].life <= 0 || particles[i].size < 0.1) {
            particles.splice(i, 1);
        }
    }
    
    if (particles.length > 0) {
        requestAnimationFrame(animateParticles);
    }
}

// Holographic distortion effect on hover
holoCard?.addEventListener('mousemove', (e) => {
    const rect = holoCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const distortion = `perspective(1000px) rotateX(${(y - 0.5) * 2}deg) rotateY(${(x - 0.5) * 2}deg)`;
    holoCard.style.transform = distortion;
    holoCard.style.transition = 'transform 0.1s ease-out';
});

holoCard?.addEventListener('mouseleave', () => {
    holoCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    holoCard.style.transition = 'transform 0.5s ease-out';
});

// --------------------
// TRANSMISSION TIMEOUT HANDLER
// --------------------
function startTransmissionTimer() {
    transmissionStartTime = Date.now();
    transmissionTimeout = setTimeout(() => {
        // Glitch effect - transmission timeout
        if (isSubmitting) {
            triggerGlitchEffect();
            cancelTransmission("⚠️ Transmission timed out after 30 seconds.");
        }
    }, TRANSMISSION_TIMEOUT);
}

function cancelTransmission(message) {
    if (transmissionTimeout) {
        clearTimeout(transmissionTimeout);
        transmissionTimeout = null;
    }
    
    isSubmitting = false;
    button.disabled = true;
    button.textContent = "✦ Submit";
    button.style.animation = '';
    button.style.background = '';
    button.style.borderColor = '';
    
    // Remove glitch after a moment
    setTimeout(() => {
        holoCard.classList.remove('glitch-active');
    }, 3000);
    
    if (message) {
        showHoloMessage(message, 'error');
    }
}

function triggerGlitchEffect() {
    // Apply glitch animation to the card
    holoCard.classList.add('glitch-active');
    
    // Create additional glitch particles
    const rect = holoCard.getBoundingClientRect();
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createTypingParticles(
                rect.left + Math.random() * rect.width,
                rect.top + Math.random() * rect.height
            );
        }, i * 20);
    }
    animateParticles();
    
    // Flash effect
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 200, 255, 0.15);
        pointer-events: none;
        z-index: 9998;
        animation: glitch-flash 0.5s ease 3;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 1500);
}

// Add glitch-flash animation
const glitchStyle = document.createElement("style");
glitchStyle.textContent = `
    @keyframes glitch-flash {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(glitchStyle);

// --------------------
// SURVEY FUNCTIONALITY
// --------------------

textarea?.addEventListener("input", () => {
    const length = textarea.value.length;
    const percentage = (length / MAX_CHARS) * 100;
    
    let color = 'rgba(200, 220, 255, 0.8)';
    if (percentage > 80) color = 'rgba(255, 200, 50, 0.9)';
    if (percentage > 95) color = 'rgba(255, 100, 50, 0.9)';
    
    counter.textContent = `${length} / ${MAX_CHARS}`;
    counter.style.color = color;
    counter.style.textShadow = `0 0 10px ${color}`;
    
    button.disabled = length === 0 || isSubmitting;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
});

let charCount = 0;
setInterval(() => {
    if (textarea?.value.length > 0) {
        charCount = (charCount + 1) % 100;
        counter.style.opacity = 0.7 + Math.sin(charCount * 0.1) * 0.3;
    }
}, 100);

button?.addEventListener("click", async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const now = Date.now();
    const text = textarea.value.trim();
    const length = text.length;
    
    if (!text || length > MAX_CHARS) {
        textarea.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            textarea.style.animation = '';
        }, 500);
        return;
    }
    
    if (now - windowStart > WINDOW_TIME) {
        windowStart = now;
        sentInWindow = 0;
    }
    
    if (now - lastSubmitTime < MIN_TIME_BETWEEN_SUBMITS) {
        showHoloMessage("⏳ Please wait before submitting again.", 'warning');
        return;
    }
    
    if (sentInWindow + length > MAX_CHARS_PER_WINDOW) {
        showHoloMessage("🚀 Submission limit reached. Please wait a few minutes.", 'warning');
        return;
    }
    
    // Start transmission
    isSubmitting = true;
    button.disabled = true;
    button.textContent = "✦ Transmitting...";
    button.style.animation = 'pulse-glow 0.5s ease infinite';
    
    // Start the 30-second timer
    startTransmissionTimer();
    
    const rect = button.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createTypingParticles(
                rect.left + Math.random() * rect.width,
                rect.top + Math.random() * rect.height
            );
        }, i * 50);
    }
    animateParticles();
    
    try {
        const res = await fetch(`${API_BASE}/survey`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                response: text,
                timestamp: now,
                length: length
            })
        });
        
        // Clear timeout since we got a response
        if (transmissionTimeout) {
            clearTimeout(transmissionTimeout);
            transmissionTimeout = null;
        }
        
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        
        const data = await res.json();
        if (!data.success) throw new Error("Submission failed");
        
        lastSubmitTime = now;
        sentInWindow += length;
        
        showHoloMessage("✓ Transmission successful!", 'success');
        button.style.background = 'rgba(0, 200, 100, 0.3)';
        button.style.borderColor = 'rgba(0, 255, 150, 0.6)';
        
        textarea.value = "";
        counter.textContent = `0 / ${MAX_CHARS}`;
        textarea.style.height = 'auto';
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                createTypingParticles(
                    rect.left + Math.random() * rect.width,
                    rect.top + Math.random() * rect.height
                );
            }, i * 30);
        }
        animateParticles();
        
    } catch (err) {
        console.error(err);
        // Only show error if not already cancelled by timeout
        if (isSubmitting) {
            if (transmissionTimeout) {
                clearTimeout(transmissionTimeout);
                transmissionTimeout = null;
            }
            showHoloMessage("❌ Transmission failed. Please try again.", 'error');
            button.style.background = 'rgba(255, 50, 50, 0.3)';
            button.style.borderColor = 'rgba(255, 100, 100, 0.6)';
        }
    } finally {
        // Only reset if not cancelled by timeout
        if (isSubmitting) {
            setTimeout(() => {
                isSubmitting = false;
                button.textContent = "✦ Submit";
                button.disabled = true;
                button.style.animation = '';
                button.style.background = '';
                button.style.borderColor = '';
            }, 1000);
        }
    }
});

function showHoloMessage(message, type = 'info') {
    const existing = document.querySelector('.holo-message');
    if (existing) existing.remove();
    
    const msg = document.createElement('div');
    msg.className = 'holo-message';
    msg.textContent = message;
    
    const colors = {
        success: 'rgba(0, 255, 150, 0.3)',
        warning: 'rgba(255, 200, 50, 0.3)',
        error: 'rgba(255, 50, 50, 0.3)',
        info: 'rgba(0, 180, 255, 0.3)'
    };
    
    msg.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 12px;
        background: ${colors[type] || colors.info};
        backdrop-filter: blur(10px);
        border: 1px solid rgba(0, 200, 255, 0.3);
        color: #e6f2ff;
        font-size: 1rem;
        font-weight: 300;
        letter-spacing: 0.05em;
        text-shadow: 0 0 10px rgba(0, 180, 255, 0.3);
        box-shadow: 0 0 30px rgba(0, 180, 255, 0.1);
        z-index: 10000;
        animation: slideDown 0.5s ease;
        transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(msg);
    
    setTimeout(() => {
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 500);
    }, 3000);
}

// Inject animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    
    @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(0, 180, 255, 0.3); }
        50% { box-shadow: 0 0 40px rgba(0, 180, 255, 0.6); }
    }
    
    @keyframes slideDown {
        0% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
        100% { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(styleSheet);

console.log("✅ Holographic System Initialized");
console.log(`⏱️ Transmission timeout: ${TRANSMISSION_TIMEOUT/1000} seconds`);