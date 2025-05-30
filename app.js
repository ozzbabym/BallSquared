// Game constants
const PI = Math.PI;
const TWO_PI = 2 * PI;
const HALF_PI = PI / 2;
const MAX_SPEED = 3;
const FRAME_RATE = 50; // ~20ms per frame
const BALL_RADIUS = 8;
const FRUIT_RADIUS = 10;
const CENTER_RADIUS = 5;

// Game state
const state = {
    canvas: null,
    ctx: null,
    width: 480,
    height: 640,
    centerX: 0,
    centerY: 0,
    angle: 0,
    radius: 0,
    positionBallX: 0,
    positionBallY: 0,
    ballx: 0,
    bally: 0,
    speed: 1,
    score: 0,
    ballAngle: 0, // Направление движения шарика
    isBallActive: false,
    leftPressed: false,
    rightPressed: false,
    gameActive: false,
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
    // Calculate dimensions
    state.centerX = state.width / 2;
    state.centerY = state.height / 3;
    state.radius = Math.min(state.width, state.height) * 0.4;
    
    // Set canvas dimensions
    elements.canvas.width = state.width;
    elements.canvas.height = state.height;
    
    // Set up event listeners
    setupEventListeners();
    
    // Start game
    newGame();
}

function resetGame() {
    state.positionBallX = state.centerX + (state.radius / 4);
    state.positionBallY = state.centerY + (state.radius / 4);
    placeNewFruit();
    state.score = 0;
    state.speed = 1;
    state.isBallActive = true;
    state.angle = 0;
    state.ballAngle = Math.random() * TWO_PI; // Random initial direction
    state.gameActive = true;
}

function placeNewFruit() {
    // Place fruit at random position but not too close to center
    let angle = Math.random() * TWO_PI;
    let distance = state.radius * 0.3 + Math.random() * state.radius * 0.5;
    state.ballx = state.centerX + distance * Math.cos(angle);
    state.bally = state.centerY + distance * Math.sin(angle);
}

function setupEventListeners() {
    // Button events
    elements.newGameBtn.addEventListener('click', newGame);
    elements.restartBtn.addEventListener('click', restart);
    elements.leftBtn.addEventListener('click', () => { 
        state.leftPressed = true; 
        state.rightPressed = false;
    });
    elements.rightBtn.addEventListener('click', () => { 
        state.rightPressed = true; 
        state.leftPressed = false;
    });
    elements.stopBtn.addEventListener('click', stop);
    
    // Touch events for mobile
    elements.leftBtn.addEventListener('touchstart', () => { 
        state.leftPressed = true; 
        state.rightPressed = false;
    });
    elements.rightBtn.addEventListener('touchstart', () => { 
        state.rightPressed = true; 
        state.leftPressed = false;
    });
    elements.stopBtn.addEventListener('touchstart', stop);
    
    // Release events
    const releaseControls = () => {
        state.leftPressed = false;
        state.rightPressed = false;
    };
    
    elements.leftBtn.addEventListener('touchend', releaseControls);
    elements.rightBtn.addEventListener('touchend', releaseControls);
    elements.stopBtn.addEventListener('touchend', releaseControls);
    
    // Window resize
    window.addEventListener('resize', handleResize);
}

function handleResize() {
    state.width = 480;
    state.height = 640;
    state.centerX = state.width / 2;
    state.centerY = state.height / 3;
    state.radius = Math.min(state.width, state.height) * 0.4;
    
    elements.canvas.width = state.width;
    elements.canvas.height = state.height;
}

function newGame() {
    hideMenu();
    resetGame();
    gameLoop();
}

function restart() {
    resetGame();
}

function stop() {
    state.leftPressed = false;
    state.rightPressed = false;
}

function hideMenu() {
    elements.menu.style.display = "none";
}

function showMenu() {
    elements.menu.style.display = "flex";
}

function gameOver() {
    state.ctx.beginPath();
    state.ctx.fillStyle = "#00F";
    state.ctx.strokeStyle = "#F00";
    state.ctx.font = "italic 20pt Arial";
    state.ctx.fillText("Game Over", state.centerX - 70, state.centerY - 20);
    state.audio.gameover.play().catch(e => console.log("Audio play failed:", e));
    state.gameActive = false;
}

function playCollisionSound() {
    state.audio.stena.play().catch(e => console.log("Audio play failed:", e));
}

function playFruitSound() {
    state.audio.fruit.play().catch(e => console.log("Audio play failed:", e));
}

function getSquarePoints() {
    return [
        { x: state.centerX + state.radius * Math.cos(state.angle), y: state.centerY + state.radius * Math.sin(state.angle) },
        { x: state.centerX + state.radius * Math.cos(state.angle + HALF_PI), y: state.centerY + state.radius * Math.sin(state.angle + HALF_PI) },
        { x: state.centerX + state.radius * Math.cos(state.angle + PI), y: state.centerY + state.radius * Math.sin(state.angle + PI) },
        { x: state.centerX + state.radius * Math.cos(state.angle + PI + HALF_PI), y: state.centerY + state.radius * Math.sin(state.angle + PI + HALF_PI) }
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
    
    // Limit angle range
    if (state.angle >= PI) state.angle -= TWO_PI;
    else if (state.angle <= -PI) state.angle += TWO_PI;
    
    // Update angle based on controls
    if (state.leftPressed) state.angle -= 0.02;
    if (state.rightPressed) state.angle += 0.02;
}

function draw() {
    const ctx = state.ctx;
    
    // Clear canvas
    ctx.fillStyle = "yellow";
    ctx.fillRect(0, 0, state.width, state.height);
    
    // Draw square
    const squarePoints = getSquarePoints();
    
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(squarePoints[0].x, squarePoints[0].y);
    for (let i = 1; i <= 4; i++) {
        ctx.lineTo(squarePoints[i % 4].x, squarePoints[i % 4].y);
    }
    ctx.lineWidth = 7;
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.stroke();
    
    // Draw center
    ctx.beginPath();
    ctx.arc(state.centerX, state.centerY, CENTER_RADIUS, 0, TWO_PI);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 5;
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
    
    // Draw fruit
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
    ctx.font = "italic 10pt Arial";
    ctx.fillText("Score: " + state.score, 20, 30);
    ctx.fillText("Speed: " + state.speed.toFixed(1), state.width - 100, 30);
}

function gameLoop() {
    if (state.gameActive) {
        updateSquareRotation();
        updateBallPosition();
        checkCollisions();
    }
    
    draw();
    
    setTimeout(gameLoop, 1000/FRAME_RATE);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    state.canvas = elements.canvas;
    state.ctx = state.canvas.getContext('2d');
    init();
});