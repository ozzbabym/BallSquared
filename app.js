var $ = function(id) { return document.getElementById(id) };

var canvas, ctx;

var W = window.innerWidth;
var H = window.innerHeight;

if(W>480){
    W=480
}
if(H>640){
    h=640
}






function new_game() {
    hide_menu();
    ball1 = true;
}





function init() {

    canvas = document.getElementById('canvas')

    ctx = canvas.getContext('2d');

    canvas.width = W;
    canvas.height = (H / 100) * 70;

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


function GameOver1() {
    ctx.beginPath();
    ctx.fillStyle = "#00F";
    ctx.strokeStyle = "#F00";
    ctx.font = "italic 20pt Arial";
    ctx.fillText("Game Over", xx - 70, yy - 20);
}












function hide_menu() {
    $('menu').hidden = true;
};

function show_menu() {
    $('menu').hidden = false;
}

var pi = Math.PI
var xx = W / 2;
var yy = H / 3;
var angle = 0;

var rad = (Math.sqrt((Math.pow(H, 2)) + (Math.pow(W, 2)))) / 4.5;
var xxx = xx + (rad / 4);
var yyy = yy + (rad / 4);

var ballx = 0;
var bally = 0;

ballx = getRandomFloat(xx - 70, xx + 70);
bally = getRandomFloat(yy - 70, yy + 70);

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
    xxx = xx + (rad / 4);
    yyy = yy + (rad / 4);
    ballx = getRandomFloat(xx - 70, xx + 70);
    bally = getRandomFloat(yy - 70, yy + 70);
    score = 0;
    speed = 1;
    if (ball1 == false || ball1 == true) {
        ball5 = true;

    }
}

function draw() {


    ctx.fillRect(0, 0, W, H);
    var xx1 = xx + rad * Math.cos(angle);
    var yy1 = yy + rad * Math.sin(angle);

    var xx2 = xx + rad * Math.cos(angle + 1.57);
    var yy2 = yy + rad * Math.sin(angle + 1.57);

    var xx3 = xx + rad * Math.cos(angle + 3.14);
    var yy3 = yy + rad * Math.sin(angle + 3.14);

    var xx4 = xx + rad * Math.cos(angle + 4.71);
    var yy4 = yy + rad * Math.sin(angle + 4.71);

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




    xy = Math.sqrt(Math.pow(((xx1) - (xx2)), 2) + Math.pow(((yy1) - (yy2)), 2));
    xc = Math.sqrt(Math.pow((xxx - (xx2)), 2) + Math.pow((yyy - (yy2)), 2));
    cy = Math.sqrt(Math.pow(((xx1) - xxx), 2) + Math.pow(((yy1) - yyy), 2));
    cosA = (Math.pow(xy, 2) + Math.pow(xc, 2) - Math.pow(cy, 2)) / (2 * xy * xc);

    xd = xc * cosA;
    dc = Math.sqrt(Math.pow(xc, 2) - Math.pow(xd, 2));


    xxx1 = xxx + dc * Math.cos(angle + 0.785);
    yyy1 = yyy + dc * Math.sin(angle + 0.785);

    xy1 = Math.sqrt(Math.pow(((xx2) - (xx3)), 2) + Math.pow(((yy2) - (yy3)), 2));
    xc1 = Math.sqrt(Math.pow((xxx - (xx3)), 2) + Math.pow((yyy - (yy3)), 2));
    cy1 = Math.sqrt(Math.pow(((xx2) - xxx), 2) + Math.pow(((yy2) - yyy), 2));
    cosA1 = ((Math.pow(xy1, 2) + Math.pow(xc1, 2)) - Math.pow(cy1, 2)) / (2 * xy1 * xc1);
    xd1 = xc1 * cosA1;
    dc1 = Math.sqrt(Math.pow(xc1, 2) - Math.pow(xd1, 2));
    xxx2 = xxx + dc1 * Math.cos(angle + 2.355);
    yyy2 = yyy + dc1 * Math.sin(angle + 2.355);


    xy2 = Math.sqrt(Math.pow(((xx3) - (xx4)), 2) + Math.pow(((yy3) - (yy4)), 2));
    xc2 = Math.sqrt(Math.pow((xxx - (xx4)), 2) + Math.pow((yyy - (yy4)), 2));
    cy2 = Math.sqrt(Math.pow(((xx3) - xxx), 2) + Math.pow(((yy3) - yyy), 2));
    cosA2 = ((Math.pow(xy2, 2) + Math.pow(xc2, 2)) - Math.pow(cy2, 2)) / (2 * xy2 * xc2);
    xd2 = xc2 * cosA2;
    dc2 = Math.sqrt(Math.pow(xc2, 2) - Math.pow(xd2, 2));
    xxx3 = xxx + dc2 * Math.cos(angle + 3.925);
    yyy3 = yyy + dc2 * Math.sin(angle + 3.925);

    xy3 = Math.sqrt(Math.pow(((xx4) - (xx1)), 2) + Math.pow(((yy4) - (yy1)), 2));
    xc3 = Math.sqrt(Math.pow((xxx - (xx1)), 2) + Math.pow((yyy - (yy1)), 2));
    cy3 = Math.sqrt(Math.pow(((xx4) - xxx), 2) + Math.pow(((yy4) - yyy), 2));
    cosA3 = ((Math.pow(xy3, 2) + Math.pow(xc3, 2)) - Math.pow(cy3, 2)) / (2 * xy3 * xc3);
    xd3 = xc3 * cosA3;
    dc3 = Math.sqrt(Math.pow(xc3, 2) - Math.pow(xd3, 2));
    xxx4 = xxx + dc3 * Math.cos(angle + 5.495);
    yyy4 = yyy + dc3 * Math.sin(angle + 5.495);

    //логика шарика


    if (ball5 == true) {
        xxx = xxx + speed * Math.cos(angle5);
        yyy = yyy + speed * Math.sin(angle5);


    }
    if (((dc <= 10) || (dc <= 0)) && (angle5 > -0.785) && (angle5 < 0.785)) {

        angle5 = 4.71 + angle;
        Stena();


    }
    if (((dc3 <= 10) || (dc3 <= 0)) && (angle5 > 3.925) && (angle5 < 5.495)) {

        angle5 = 3.14 + angle;
        Stena();

    }

    if (((dc2 <= 10) || (dc2 <= 0)) && (angle5 > 2.3557) && (angle5 < 3.925)) {

        angle5 = 1.57 + angle;
        Stena();

    }
    if (((dc1 <= 10) || (dc1 <= 0)) && (angle5 < 1.57 + 0.785) && (angle5 > 0.785)) {

        angle5 = angle;
        Stena();

    }
    ///
    if (((dc3 <= 10) || (dc3 <= 0)) && (angle5 > -0.785) && (angle5 < 0.785)) {

        angle5 = 1.57 + angle;
        Stena();

    }
    if (((dc <= 10) || (dc <= 0)) && (angle5 > 0.785) && (angle5 < 0.785 + 1.57)) {

        angle5 = 3.14 + angle;
        Stena();

    }
    if (((dc1 <= 10) || (dc1 <= 0)) && (angle5 > 1.57 + 0.785) && (angle5 < 3.925)) {

        angle5 = 4.71 + angle;
        Stena();

    }
    if (((dc2 <= 10) || (dc2 <= 0)) && (angle5 > 3.925) && (angle5 < 4.71 + 0.785)) {

        angle5 = angle;
        Stena();

    }



    GameOver = Math.sqrt(Math.pow((xx - xxx), 2) + Math.pow((yy - yyy), 2));
    if (GameOver <= 10) {
        ball5 = false;



    }

    Fruit = Math.sqrt(Math.pow((xxx - ballx), 2) + Math.pow((yyy - bally), 2));
    if (Fruit <= 14) {
        ballx = getRandomFloat(xx - (W / 4), xx + (W / 4));
        bally = getRandomFloat(yy - (H / 8), yy + (H / 8));
        score += 10;
        speed += 0.1;
        FruitS();

    }





    if (speed >= 3) {
        speed = 3;
    }



    if (xxx < 0) {
        angle5 = 0;
    }
    if (xxx > W) {
        angle5 = 3.14;
    }

    if (yyy < 0) {
        angle5 = 1.57;
    }

    if (yyy > H / 1.5) {
        angle5 = 4.71;
    }

    timer = setTimeout(draw, 20);
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(xx1, yy1);
    ctx.lineTo(xx2, yy2);
    ctx.lineTo(xx3, yy3);
    ctx.lineTo(xx4, yy4);
    ctx.closePath();

    ctx.lineWidth = "7";
    ctx.fillStyle = "yellow";

    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(xx, yy, rad / 50, 2, pi * 4, false);
    ctx.strokeStyle = "green";
    ctx.lineWidth = "5";
    ctx.fillStyle = "green";
    ctx.closePath();
    ctx.stroke();
    ctx.fill();


    ctx.beginPath();
    ctx.arc(xxx, yyy, rad / 25, 0, pi * 2, false);
    ctx.strokeStyle = "black";
    ctx.lineWidth = "2";
    ctx.fillStyle = "#28d1aa";
    ctx.closePath();
    ctx.fill();

    ctx.stroke();
    ctx.fillStyle = "yellow";

    ctx.beginPath();
    ctx.arc(ballx, bally, rad / 20, 0, pi * 2, false);
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
    ctx.fillText("Score: " + score, H / 30, W / 12);
    ctx.fillStyle = "yellow";

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.fillStyle = "#00F";
    ctx.strokeStyle = "#F00";
    ctx.font = "italic 10pt Arial";
    ctx.fillText("Speed: " + speed.toFixed(1), H / 2.5, W / 12);
    ctx.fillStyle = "yellow";


}
