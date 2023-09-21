import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'firstGame';
}

//board
var blockSize = 35;
var rows = 20;
var cols = 20;
var board : any;
var point_board : any;
var p_context : any;
var context : any; 

//muics
var bg_music = new Audio();
bg_music.src = 'assets/music/bgm2.mp3'
bg_music.loop = true
bg_music.load();
var food_sound = new Audio();
food_sound.src = 'assets/music/eat.wav'
var gg = new Audio();
gg.src = 'assets/music/gameover.wav'
//snake head
var img_big = new Image();
var img_dog = new Image();
var img_bg  = new Image();
img_big.src = 'assets/imgs/big_2.svg';
img_dog.src = 'assets/imgs/Apple.svg';
img_bg.src = 'assets/imgs/bg.png';
var head_pattern : any;
var food_pattern : any;
var bg_pattern : any;

var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody : number[][] = [];

//food
var foodX : number;
var foodY : number;

//game controll
var gameOver = false;
var points = 0;

//gameStartButton
var buttonWidth = 100;
var buttonHeight = 50;
var buttonX : number;
var buttonY : number;
var buttonHoverColor = "#31b0d5"; // lighter blue

window.onload = function(){setGame();}

function setGame() {
    board = document.getElementById("board");
    board.height = window.innerHeight;
    board.width = window.innerWidth;
    board.style.position = 'fixed';
    board.style.top = '10%';
    board.style.left = '10%';
    board.style.width = '80%';
    board.style.height = '80%';
    context = board.getContext("2d"); //used for drawing on the board
    //point board 
    point_board = document.getElementById("point_board");
    p_context = point_board.getContext("2d");
    point_board.height = window.innerHeight;
    point_board.width = window.innerWidth;
    point_board.style.position = 'fixed';
    point_board.style.top = '5%';
    point_board.style.left = '5%';
    point_board.style.width = '80%';
    point_board.style.height = '80%';
    p_context.font = "40px Arial"
    p_context.fillText(`Points: ${points}`, point_board.width / 2, 30);
    //draw button in canvas
    buttonX = (board.width - buttonWidth) / 2;
    buttonY = (board.height - buttonHeight) / 2;
    context.fillStyle = "blue";
    context.roundRect(buttonX, buttonY, buttonWidth + 80, buttonHeight+80,10);
    context.fill();
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Start Game", buttonX + 40, buttonY + 70);
// Add hover effect
    board.addEventListener("mousemove", btn_hover);
    // game start
    board.addEventListener("click",startgame)
}

function updatePoints(){
  p_context.clearRect(0, 0, point_board.width, 30);
  p_context.fillText(`Points: ${points}`, point_board.width / 2, 30);
}

function startgame(){
  bg_music.play();
  //loading img 
  head_pattern = context.createPattern(img_big, 'repeat');
  food_pattern = context.createPattern(img_dog, 'repeat');
  bg_pattern = context.createPattern(img_bg,'repeat');
  placeFood();
  document.addEventListener("keyup", changeDirection);
  board.removeEventListener('click', startgame);
  board.removeEventListener("mousemove", btn_hover);
  // update();
  setInterval(update, 1000/12); //100 milliseconds
}


function btn_hover(event:MouseEvent){
  const rect = board.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  if (x > 0 && x < buttonX  && y > 0 && y < buttonY ) {
    context.fillStyle = buttonHoverColor;
    context.roundRect(buttonX, buttonY, buttonWidth + 80, buttonHeight+80,10);
    context.fill();
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Start Game", buttonX + 40, buttonY + 70);
  } else {
    context.fillStyle = "blue";
    context.roundRect(buttonX, buttonY, buttonWidth + 80, buttonHeight+80,10);
    context.fill();
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Start Game", buttonX + 40, buttonY + 70);
  }
}

function restart(){
  snakeBody = [];
  randomLocation();
  placeFood();
  points = 0
  updatePoints();
  gameOver = false;
}


function update() {
    if (gameOver) {
      setTimeout(() => {
        console.log('End');
      }, 5000);
      restart();
    }
    context.fillStyle=bg_pattern;
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = food_pattern;
    context.fillRect(foodX, foodY, blockSize, blockSize);
    //get point
    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        food_sound.play();
        points ++;
        updatePoints();
        placeFood();
    }

    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
      
    context.fillStyle= head_pattern;

    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    //game over conditions
    if (snakeX < 0 || snakeX > board.width || snakeY < 0 || snakeY > board.height) {
        gameover();
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameover();
        }
    }
}

function gameover(){
  gameOver = true;
  bg_music.pause();
  gg.play();
  bg_music.play();
}

function changeDirection(e : any) {
    if (e.code == "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.code == "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.code == "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}


function placeFood() {
    //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function randomLocation(){

  if (snakeX != foodX && snakeY != foodY){
    snakeX = Math.floor(Math.random() * cols) * blockSize;
    snakeY = Math.floor(Math.random() * rows) * blockSize;
  }
  return
}

