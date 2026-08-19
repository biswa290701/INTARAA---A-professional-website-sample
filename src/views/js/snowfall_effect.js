const canvas = document.getElementById("snowfall");
const ctx = canvas.getContext("2d");

let width, height;
let snowflakes = [];

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight - 50; // navbar height
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Create snowflakes
function createSnowflakes() {
    snowflakes = [];
    for (let i = 0; i < 120; i++) {
    const depth = Math.random(); // 0 = far, 1 = close

    snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,

        r: Math.random() * 0.2 + 1 + depth * 1.5,  // closer = bigger
        d: Math.random() * 0.6 + 0.3 + depth,  // closer = faster

        blur: depth * 20,                       // blur strength
        alpha: 0.9 + depth * 10               // opacity
    });
    }
}

function drawSnowflakes() {
    ctx.clearRect(0, 0, width, height);

    for (let f of snowflakes) {
        ctx.beginPath();

        // Depth-based blur
        ctx.shadowBlur = f.blur;
        ctx.shadowColor = "white";

        ctx.fillStyle = `rgba(255,255,255,${f.alpha})`;
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
    }

    // Reset shadow so it doesn't affect other canvas draws
    ctx.shadowBlur = 0;

    moveSnowflakes();
}

let angle = 0;

function moveSnowflakes() {
    angle += 0.01;

    for (let f of snowflakes) {
    f.y += Math.pow(f.d, 2) + 0.3;
    f.x += Math.sin(angle) * (0.2 + f.blur * 0.05);

        if (f.y > height) {
            f.y = -10;
            f.x = Math.random() * width;
        }
    }
}

function animateSnow() {
    drawSnowflakes();
    requestAnimationFrame(animateSnow);
}

createSnowflakes();
animateSnow();