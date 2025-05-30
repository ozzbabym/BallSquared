// Game constants
const PI = Math.PI;
const TWO_PI = 2 * PI;
const HALF_PI = PI / 2;
const MAX_SPEED = 3;
const BALL_RADIUS = 8;
const FRUIT_RADIUS = 10;
const CENTER_RADIUS = 5;
const SQUARE_SIZE = 0.4; // Relative to canvas size

// Game state
const state = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    centerX: 0,
    centerY: 0,
    angle: 0,
    squareHalfDiagonal: 0,
    positionBallX: 0,
    positionBallY: 0,
    ballx: 0,
    bally: 0,
    speed: 1,
    score: 0,
    ballAngle: 0,
    isBallActive: false,
    leftPressed: false,
    rightPressed: false,
    gameActive: false,
    lastFrameTime: 0,
    audio: {
        stena: new Audio("stena.mp3"),
        fruit: new Audio("fruit.mp3"),
        gameover: new Audio("gameover.mp3")
    }
};

// DOM elements
const elements = {
    menu: document.getElementById('menu'),
    canvas: document.getElementById('canvas'),
    newGameBtn: document.getElementById('new_game'),
    restartBtn: document.getElementById('restart_btn'),
    leftBtn: document.getElementById('left_btn'),
    stopBtn: document.getElementById('stop_btn'),
    rightBtn: document.getElementById('right_btn')
};

// Initialize game
function init() {
    setupCanvas();
    setupEventListeners();
    showMenu();
}

function setupCanvas() {
    state.canvas = elements.canvas;
    state.ctx = state.canvas.getContext('2d');
    
    // Set canvas dimensions
    resizeCanvas();
    
    // Calculate game dimensions
    state.centerX = state.width / 2;
    state.centerY = state.height / 2;
    state.squareHalfDiagonal = Math.min(state.width, state.height) * SQUARE_SIZE / Math.sqrt(2);
}

function resizeCanvas() {
    const container = document.querySelector('.main-container');
    state.width = container.clientWidth;
    state.height = container.clientHeight;
    
    // Adjust for device pixel ratio
    const dpr = window.devicePixelRatio || 1;
    state.canvas.width = state.width * dpr;
    state.canvas.height = state.height * dpr;
    state.canvas.style.width = state.width + 'px';
    state.canvas.style.height = state.height + 'px';
    state.ctx.scale(dpr, dpr);
}

function resetGame() {
    state.positionBallX = state.centerX;
    state.positionBallY = state.centerY - state.squareHalfDiagonal * 0.7;
    placeNewFruit();
    state.score = 0;
    state.speed = 1;
    state.isBallActive = true;
    state.angle = 0;
    state.ballAngle = Math.random() * TWO_PI;
    state.gameActive = true;
    state.lastFrameTime = performance.now();
}

function placeNewFruit() {
    // Place fruit at random position within the square
    const angle = state.angle + Math.random() * TWO_PI;
    const distance = state.squareHalfDiagonal * 0.3 + Math.random() * state.squareHalfDiagonal * 0.5;
    
    state.ballx = state.centerX + distance * Math.cos(angle);
    state.bally = state.centerY + distance * Math.sin(angle);
}

function setupEventListeners() {
    // Button events
    elements.newGameBtn.addEventListener('click', newGame);
    elements.restartBtn.addEventListener('click', restart);
    
    // Control buttons
    elements.leftBtn.addEventListener('mousedown', () => state.leftPressed = true);
    elements.leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        state.leftPressed = true;
    });
    
    elements.rightBtn.addEventListener('mousedown', () => state.rightPressed = true);
    elements.rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        state.rightPressed = true;
    });
    
    elements.stopBtn.addEventListener('mousedown', stop);
    elements.stopBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        stop();
    });
    
    // Release events
    const releaseControls = () => {
        state.leftPressed = false;
        state.rightPressed = false;
    };
    
    document.addEventListener('mouseup', releaseControls);
    document.addEventListener('touchend', releaseControls);
    
    // Window resize
    window.addEventListener('resize', () => {
        setupCanvas();
        if (state.gameActive) draw();
    });
}

function newGame() {
    hideMenu();
    resetGame();
    requestAnimationFrame(gameLoop);
}

function restart() {
    resetGame();
}

function stop() {
    state.leftPressed = false;
    state.rightPressed = false;
}

function showMenu() {
    elements.menu.style.display = "flex";
    state.gameActive = false;
}

function hideMenu() {
    elements.menu.style.display = "none";
}

function gameOver() {
    state.ctx.beginPath();
    state.ctx.fillStyle = "#00F";
    state.ctx.strokeStyle = "#F00";
    state.ctx.font = "italic 20pt Arial";
    state.ctx.fillText("Game Over", state.centerX - 70, state.centerY - 20);
    state.audio.gameover.play().catch(e => console.log("Audio play failed:", e));
    state.gameActive = false;
    setTimeout(showMenu, 1500);
}

function playCollisionSound() {
    state.audio.stena.play().catch(e => console.log("Audio play failed:", e));
}

function playFruitSound() {
    state.audio.fruit.play().catch(e => console.log("Audio play failed:", e));
}

function getSquarePoints() {
    const cos = Math.cos(state.angle);
    const sin = Math.sin(state.angle);
    const size = state.squareHalfDiagonal;
    
    return [
        { x: state.centerX + size * (cos - sin), y: state.centerY + size * (sin + cos) },
        { x: state.centerX + size * (-cos - sin), y: state.centerY + size * (-sin + cos) },
        { x: state.centerX + size * (-cos + sin), y: state.centerY + size * (-sin - cos) },
        { x: state.centerX + size * (cos + sin), y: state.centerY + size * (sin - cos) }
    ];
}

function checkCollisions() {
    const squarePoints = getSquarePoints();
    
    for (let i = 0; i < 4; i++) {
        const p1 = squarePoints[i];
        const p2 = squarePoints[(i + 1) % 4];
        
        // Vector of the square side
        const sideVec = { x: p2.x - p1.x, y: p2.y - p1.y };
        
        // Vector from p1 to ball
        const ballVec = { x: state.positionBallX - p1.x, y: state.positionBallY - p1.y };
        
        // Project ball vector onto side vector
        const sideLength = Math.hypot(sideVec.x, sideVec.y);
        const dotProduct = (ballVec.x * sideVec.x + ballVec.y * sideVec.y) / (sideLength * sideLength);
        
        // Find closest point on the side to the ball
        let closestPoint;
        if (dotProduct < 0) {
            closestPoint = p1;
        } else if (dotProduct > 1) {
            closestPoint = p2;
        } else {
            closestPoint = {
                x: p1.x + dotProduct * sideVec.x,
                y: p1.y + dotProduct * sideVec.y
            };
        }
        
        // Distance from ball to closest point on the side
        const distance = Math.hypot(state.positionBallX - closestPoint.x, state.positionBallY - closestPoint.y);
        
        // If collision detected
        if (distance <= BALL_RADIUS) {
            // Calculate normal vector to the side
            const normal = {
                x: -sideVec.y / sideLength,
                y: sideVec.x / sideLength
            };
            
            // Calculate reflection angle (angle of incidence = angle of reflection)
            const incidenceAngle = Math.atan2(Math.sin(state.ballAngle), Math.cos(state.ballAngle));
            const normalAngle = Math.atan2(normal.y, normal.x);
            const reflectionAngle = 2 * normalAngle - incidenceAngle + PI;
            
            // Update ball direction
            state.ballAngle = reflectionAngle;
            
            // Move ball slightly away from the side to prevent sticking
            state.positionBallX += normal.x * (BALL_RADIUS - distance + 1);
            state.positionBallY += normal.y * (BALL_RADIUS - distance + 1);
            
            playCollisionSound();
            break;
        }
    }
    
    // Check collision with center
    const distanceToCenter = Math.hypot(state.centerX - state.positionBallX, state.centerY - state.positionBallY);
    if (distanceToCenter <= CENTER_RADIUS + BALL_RADIUS) {
        state.isBallActive = false;
        gameOver();
    }
    
    // Check collision with fruit
    const distanceToFruit = Math.hypot(state.positionBallX - state.ballx, state.positionBallY - state.bally);
    if (distanceToFruit <= FRUIT_RADIUS + BALL_RADIUS) {
        placeNewFruit();
        state.score += 10;
        state.speed = Math.min(state.speed + 0.1, MAX_SPEED);
        playFruitSound();
    }
}

function updateBallPosition() {
    if (!state.isBallActive) return;
    
    state.positionBallX += state.speed * Math.cos(state.ballAngle);
    state.positionBallY += state.speed * Math.sin(state.ballAngle);
    
    // Boundary checks
    if (state.positionBallX < BALL_RADIUS) {
        state.positionBallX = BALL_RADIUS;
        state.ballAngle = PI - state.ballAngle;
    }
    if (state.positionBallX > state.width - BALL_RADIUS) {
        state.positionBallX = state.width - BALL_RADIUS;
        state.ballAngle = PI - state.ballAngle;
    }
    if (state.positionBallY < BALL_RADIUS) {
        state.positionBallY = BALL_RADIUS;
        state.ballAngle = -state.ballAngle;
    }
    if (state.positionBallY > state.height - BALL_RADIUS) {
        state.positionBallY = state.height - BALL_RADIUS;
        state.ballAngle = -state.ballAngle;
    }
}

function updateSquareRotation() {
    if (!state.gameActive) return;
    
    // Update angle based on controls
    if (state.leftPressed) state.angle -= 0.03;
    if (state.rightPressed) state.angle += 0.03;
    
    // Keep angle in reasonable range
    if (state.angle > PI) state.angle -= TWO_PI;
    if (state.angle < -PI) state.angle += TWO_PI;
}

function draw() {
    const ctx = state.ctx;
    
    // Clear canvas with yellow background
    ctx.fillStyle = "yellow";
    ctx.fillRect(0, 0, state.width, state.height);
    
    // Draw square
    const squarePoints = getSquarePoints();
    
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 4;
    ctx.moveTo(squarePoints[0].x, squarePoints[0].y);
    for (let i = 1; i <= 4; i++) {
        ctx.lineTo(squarePoints[i % 4].x, squarePoints[i % 4].y);
    }
    ctx.closePath();
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.stroke();
    
    // Draw center
    ctx.beginPath();
    ctx.arc(state.centerX, state.centerY, CENTER_RADIUS, 0, TWO_PI);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 3;
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.stroke();
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(state.positionBallX, state.positionBallY, BALL_RADIUS, 0, TWO_PI);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#28d1aa";
    ctx.fill();
    ctx.stroke();
    
    // Draw fruit (blue circle)
    ctx.beginPath();
    ctx.arc(state.ballx, state.bally, FRUIT_RADIUS, 0, TWO_PI);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.stroke();
    
    // Draw score and speed
    ctx.fillStyle = "#00F";
    ctx.strokeStyle = "#F00";
    ctx.font = "italic 16px Arial";
    ctx.fillText("Score: " + state.score, 20, 30);
    ctx.fillText("Speed: " + state.speed.toFixed(1), state.width - 120, 30);
}

function gameLoop(timestamp) {
    if (!state.gameActive) return;
    
    updateSquareRotation();
    updateBallPosition();
    checkCollisions();
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);