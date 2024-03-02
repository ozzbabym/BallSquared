var $ = function(id) { return document.getElementById(id) };

var canvas, ctx;

var widthWindow = window.innerWidth;
var heightWindow = window.innerHeight;

if (widthWindow > 400) {
    widthWindow = 420;
}
if(heightWindow>600){
    heightWindow=640;
}

function new_game() {
    hide_menu();
    init();
    ball1 = true;
}

function init() {

    canvas = document.getElementById('canvas')

    ctx = canvas.getContext('2d');

    canvas.width = widthWindow;
    canvas.height = (heightWindow / 100) * 70;

    draw();
}
var LeftT = false;
var RightT = false;

function Right() {
    RightT = true;
    LeftT = false;

}
// function RightStop() {
//     RightT = false;
// //     LeftT = false;

// }

function Left() {
    LeftT = true;
    RightT = false;
}

// function LeftStop() {
//     LeftT = false;
// //     RightT = false;
// }

function Pause() {
    show_menu();
    LeftT = false;
    RightT = false;
}

function Continue() {
    show_menu();
    LeftT = false;
    RightT = false;
    hide_menu();
}



function hide_menu() {
    $('menu').style.display = "none";
};

function show_menu() {
    $('menu').style.display = "flex";
}

var pi = Math.PI
var centerX = widthWindow / 2;
var centerY = heightWindow / 3;
var angle = 0;

var radius = (Math.sqrt((Math.pow(heightWindow, 2)) + (Math.pow(widthWindow, 2)))) / 4.5;
var positionBallX = centerX + (radius / 4);
var positionBallY = centerY + (radius / 4);

var ballx = 0;
var bally = 0;

ballx = getRandomFloat(centerX - 70, centerX + 70);
bally = getRandomFloat(centerY - 70, centerY + 70);

var xy, xc, cy, cosA, xd, dc;
var xy1, xc1, cy1, cosA1, xd1, dc1;
var xy2, xc2, cy2, cosA2, xd2, dc2;
var xy3, xc3, cy3, cosA3, xd3, dc3;
var xxx2;
var yyy2;
var speed = 1;
var GameOver;
var xxx1;
var yyy1;
var score = 0;
var Fruit;
var ball1 = false;
var ball2 = false;
var ball3 = false;
var ball4 = false;
var angle5 = 0;
var radian = 6.28;
var ball5 = true;

function GameOver1() {
    ctx.beginPath();
    ctx.fillStyle = "#00F";
    ctx.strokeStyle = "#F00";
    ctx.font = "italic 20pt Arial";
    ctx.fillText("Game Over", centerX - 70, centerY - 20);
}

function Stena() {
    var audio = new Audio(); // Создаём новый элемент Audio
    audio.src = "stena.mp3"; // Указываем путь к звуку "клика"
    audio.autoplay = true;
}

function FruitS() {
    var audio = new Audio(); // Создаём новый элемент Audio
    audio.src = "fruit.mp3"; // Указываем путь к звуку "клика"
    audio.autoplay = true;
}

function Gameovers() {
    var audio = new Audio(); // Создаём новый элемент Audio
    audio.src = "gameover.mp3"; // Указываем путь к звуку "клика"
    audio.autoplay = true;
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function Stop() {
    LeftT = false;
    RightT = false;
}

function Restart() {
    positionBallX = centerX + (radius / 4);
    positionBallY = centerY + (radius / 4);
    ballx = getRandomFloat(centerX - 70, centerX + 70);
    bally = getRandomFloat(centerY - 70, centerY + 70);
    score = 0;
    speed = 1;
    if (ball1 == false || ball1 == true) {
        ball5 = true;
    }
}

function getLinePosition(angle, x, y, radius, anglePart = 0) {
    let positionLineX = x + radius * Math.cos(angle, anglePart);
    let positionLineY = y + radius * Math.sin(angle, anglePart);
    return [positionLineX, positionLineY];
}

function draw() {
    ctx.fillRect(0, 0, 420, 640);

    var anglePointX1 = centerX + radius * Math.cos(angle);
    var anglePointY1 = centerY + radius * Math.sin(angle);

    var anglePointX2 = centerX + radius * Math.cos(angle + 1.57);
    var anglePointY2 = centerY + radius * Math.sin(angle + 1.57);

    var anglePointX3 = centerX + radius * Math.cos(angle + 3.14);
    var anglePointY3 = centerY + radius * Math.sin(angle + 3.14);

    var anglePointX4 = centerX + radius * Math.cos(angle + 4.71);
    var anglePointY4 = centerY + radius * Math.sin(angle + 4.71);

    if (angle >= 0.785) {
        angle = -0.785;
    } else if (angle <= -0.785) {
        angle = 0.785;
    }

    if (LeftT == true) {
        angle -= 0.01;
    }

    if (RightT == true) {
        angle += 0.01;
    }

    xy = Math.sqrt(Math.pow(((anglePointX1) - (anglePointX2)), 2) + Math.pow(((anglePointY1) - (anglePointY2)), 2));
    xc = Math.sqrt(Math.pow((positionBallX - (anglePointX2)), 2) + Math.pow((positionBallY - (anglePointY2)), 2));
    cy = Math.sqrt(Math.pow(((anglePointX1) - positionBallX), 2) + Math.pow(((anglePointY1) - positionBallY), 2));
    cosA = (Math.pow(xy, 2) + Math.pow(xc, 2) - Math.pow(cy, 2)) / (2 * xy * xc);
    xd = xc * cosA;
    dc = Math.sqrt(Math.pow(xc, 2) - Math.pow(xd, 2));
    xxx1 = positionBallX + dc * Math.cos(angle + 0.785);
    yyy1 = positionBallY + dc * Math.sin(angle + 0.785);

    xy1 = Math.sqrt(Math.pow(((anglePointX2) - (anglePointX3)), 2) + Math.pow(((anglePointY2) - (anglePointY3)), 2));
    xc1 = Math.sqrt(Math.pow((positionBallX - (anglePointX3)), 2) + Math.pow((positionBallY - (anglePointY3)), 2));
    cy1 = Math.sqrt(Math.pow(((anglePointX2) - positionBallX), 2) + Math.pow(((anglePointY2) - positionBallY), 2));
    cosA1 = ((Math.pow(xy1, 2) + Math.pow(xc1, 2)) - Math.pow(cy1, 2)) / (2 * xy1 * xc1);
    xd1 = xc1 * cosA1;
    dc1 = Math.sqrt(Math.pow(xc1, 2) - Math.pow(xd1, 2));
    xxx2 = positionBallX + dc1 * Math.cos(angle + 2.355);
    yyy2 = positionBallY + dc1 * Math.sin(angle + 2.355);

    xy2 = Math.sqrt(Math.pow(((anglePointX3) - (anglePointX4)), 2) + Math.pow(((anglePointY3) - (anglePointY4)), 2));
    xc2 = Math.sqrt(Math.pow((positionBallX - (anglePointX4)), 2) + Math.pow((positionBallY - (anglePointY4)), 2));
    cy2 = Math.sqrt(Math.pow(((anglePointX3) - positionBallX), 2) + Math.pow(((anglePointY3) - positionBallY), 2));
    cosA2 = ((Math.pow(xy2, 2) + Math.pow(xc2, 2)) - Math.pow(cy2, 2)) / (2 * xy2 * xc2);
    xd2 = xc2 * cosA2;
    dc2 = Math.sqrt(Math.pow(xc2, 2) - Math.pow(xd2, 2));
    xxx3 = positionBallX + dc2 * Math.cos(angle + 3.925);
    yyy3 = positionBallY + dc2 * Math.sin(angle + 3.925);

    xy3 = Math.sqrt(Math.pow(((anglePointX4) - (anglePointX1)), 2) + Math.pow(((anglePointY4) - (anglePointY1)), 2));
    xc3 = Math.sqrt(Math.pow((positionBallX - (anglePointX1)), 2) + Math.pow((positionBallY - (anglePointY1)), 2));
    cy3 = Math.sqrt(Math.pow(((anglePointX4) - positionBallX), 2) + Math.pow(((anglePointY4) - positionBallY), 2));
    cosA3 = ((Math.pow(xy3, 2) + Math.pow(xc3, 2)) - Math.pow(cy3, 2)) / (2 * xy3 * xc3);
    xd3 = xc3 * cosA3;
    dc3 = Math.sqrt(Math.pow(xc3, 2) - Math.pow(xd3, 2));
    xxx4 = positionBallX + dc3 * Math.cos(angle + 5.495);
    yyy4 = positionBallY + dc3 * Math.sin(angle + 5.495);

    //логика шарика

    if (ball5 == true) {
        positionBallX = positionBallX + speed * Math.cos(angle5);
        positionBallY = positionBallY + speed * Math.sin(angle5);
    }
    console.log(angle5)
    if (((dc <= 10) || (dc <= 0)) && (angle5 > -0.785) && (angle5 < 0.785)) {
        angle5 = 4.71 + angle/2;
        // Stena();
    }
    if (((dc3 <= 10) || (dc3 <= 0)) && (angle5 > 3.925) && (angle5 < 5.495)) {
        angle5 = 3.14 + angle/2;
        // Stena();
    }

    if (((dc2 <= 10) || (dc2 <= 0)) && (angle5 > 2.3557) && (angle5 < 3.925)) {
        angle5 = 1.57 + angle/2;
        // Stena();
    }
    if (((dc1 <= 10) || (dc1 <= 0)) && (angle5 < 1.57 + 0.785) && (angle5 > 0.785)) {
        angle5 = angle/2;
        // Stena();
    }
    ///
    if (((dc3 <= 10) || (dc3 <= 0)) && (angle5 > -0.785) && (angle5 < 0.785)) {
        angle5 = 1.57 + angle/2;
        // Stena();
    }
    if (((dc <= 10) || (dc <= 0)) && (angle5 > 0.785) && (angle5 < 0.785 + 1.57)) {
        angle5 = 3.14 + angle/2;
        // Stena();
    }
    if (((dc1 <= 10) || (dc1 <= 0)) && (angle5 > 1.57 + 0.785) && (angle5 < 3.925)) {
        angle5 = 4.71 + angle/2;
        // Stena();
    }
    if (((dc2 <= 10) || (dc2 <= 0)) && (angle5 > 3.925) && (angle5 < 4.71 + 0.785)) {
        angle5 = angle/2;
        // Stena();
    }

    GameOver = Math.sqrt(Math.pow((centerX - positionBallX), 2) + Math.pow((centerY - positionBallY), 2));
    if (GameOver <= 10) {
        ball5 = false;
    }

    Fruit = Math.sqrt(Math.pow((positionBallX - ballx), 2) + Math.pow((positionBallY - bally), 2));
    if (Fruit <= 14) {
        ballx = getRandomFloat(centerX - (widthWindow / 4), centerX + (widthWindow / 4));
        bally = getRandomFloat(centerY - (heightWindow / 8), centerY + (heightWindow / 8));
        score += 10;
        speed += 0.1;
        FruitS();
    }

    if (speed >= 3) {
        speed = 3;
    }

    if (positionBallX < 0) {
        angle5 = 0;
    }
    if (positionBallX > widthWindow) {
        angle5 = 3.14;
    }

    if (positionBallY < 0) {
        angle5 = 1.57;
    }

    if (positionBallY > heightWindow / 1.5) {
        angle5 = 4.71;
    }

    timer = setTimeout(draw, 20);
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(anglePointX1, anglePointY1);
    ctx.lineTo(anglePointX2, anglePointY2);
    ctx.lineTo(anglePointX3, anglePointY3);
    ctx.lineTo(anglePointX4, anglePointY4);
    ctx.closePath();

    ctx.lineWidth = "7";
    ctx.fillStyle = "yellow";

    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius / 50, 2, pi * 4, false);
    ctx.strokeStyle = "green";
    ctx.lineWidth = "5";
    ctx.fillStyle = "green";
    ctx.closePath();
    ctx.stroke();
    ctx.fill();


    ctx.beginPath();
    ctx.arc(positionBallX, positionBallY, radius / 25, 0, pi * 2, false);
    ctx.strokeStyle = "black";
    ctx.lineWidth = "2";
    ctx.fillStyle = "#28d1aa";
    ctx.closePath();
    ctx.fill();

    ctx.stroke();
    ctx.fillStyle = "yellow";

    ctx.beginPath();
    ctx.arc(ballx, bally, radius / 20, 0, pi * 2, false);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = "2";
    ctx.fillStyle = "blue";
    ctx.closePath();
    ctx.fill();

    ctx.stroke();
    ctx.fillStyle = "yellow";

    if (GameOver <= 10) {
        GameOver1();
    }

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.fillStyle = "#00F";
    ctx.strokeStyle = "#F00";
    ctx.font = "italic 10pt Arial";
    ctx.fillText("Score: " + score, heightWindow / 30, widthWindow / 12);
    ctx.fillStyle = "yellow";

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.fillStyle = "#00F";
    ctx.strokeStyle = "#F00";
    ctx.font = "italic 10pt Arial";
    ctx.fillText("Speed: " + speed.toFixed(1), heightWindow / 2.5, widthWindow / 12);
    ctx.fillStyle = "yellow";
}