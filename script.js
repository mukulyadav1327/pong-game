// Canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;
const paddleSpeed = 6;
const ballSpeed = 5;
const computerSpeed = 4;

// Player paddle
const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0
};

// Computer paddle
const computer = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: ballSpeed,
    dy: ballSpeed,
    size: ballSize,
    speed: ballSpeed
};

// Input handling
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    // Arrow keys for paddle control
    if (e.key === 'ArrowUp') {
        player.dy = -paddleSpeed;
    } else if (e.key === 'ArrowDown') {
        player.dy = paddleSpeed;
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        player.dy = 0;
    }
});

// Mouse control
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    // Move paddle to follow mouse
    player.y = Math.max(0, Math.min(mouseY - player.height / 2, canvas.height - player.height));
});

// Update player paddle position based on keyboard input
function updatePlayerPaddle() {
    player.y += player.dy;
    
    // Boundary collision for player paddle
    if (player.y < 0) {
        player.y = 0;
    }
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

// Update computer paddle (AI)
function updateComputerPaddle() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;
    
    // AI logic - follow the ball
    if (computerCenter < ballCenter - 35) {
        computer.y += computerSpeed;
    } else if (computerCenter > ballCenter + 35) {
        computer.y -= computerSpeed;
    }
    
    // Boundary collision for computer paddle
    if (computer.y < 0) {
        computer.y = 0;
    }
    if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Top and bottom wall collision
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = Math.max(ball.size, Math.min(canvas.height - ball.size, ball.y));
    }
    
    // Paddle collision - Player paddle
    if (ball.x - ball.size < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height) {
        ball.dx = Math.abs(ball.dx);
        ball.x = player.x + player.width + ball.size;
        
        // Add spin based on where ball hits paddle
        const collidePoint = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        ball.dy = collidePoint * ball.speed;
    }
    
    // Paddle collision - Computer paddle
    if (ball.x + ball.size > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height) {
        ball.dx = -Math.abs(ball.dx);
        ball.x = computer.x - ball.size;
        
        // Add spin based on where ball hits paddle
        const collidePoint = (ball.y - (computer.y + computer.height / 2)) / (computer.height / 2);
        ball.dy = collidePoint * ball.speed;
    }
    
    // Left wall - Computer scores
    if (ball.x - ball.size < 0) {
        computer.score++;
        updateScore();
        resetBall();
    }
    
    // Right wall - Player scores
    if (ball.x + ball.size > canvas.width) {
        player.score++;
        updateScore();
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ballSpeed;
    ball.dy = (Math.random() - 0.5) * ballSpeed;
}

// Update scoreboard
function updateScore() {
    document.getElementById('playerScore').textContent = player.score;
    document.getElementById('computerScore').textContent = computer.score;
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 10;
}

function drawBall() {
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 15;
}

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.shadowBlur = 0;
    
    // Draw center line
    drawCenterLine();
    
    // Draw paddles and ball
    drawPaddle(player);
    drawPaddle(computer);
    drawBall();
}

// Main game loop
function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();