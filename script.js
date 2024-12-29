let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 12;
let score = 0;
let lastPaintTime = 0;
let foodArr = ["watermelon","apple", "mouse"];
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let currentFoodChoice;
let gameRunning = true;

function generateFoodChoice() {
    let arrayNo = Math.floor(Math.random() * foodArr.length);
    currentFoodChoice = foodArr[arrayNo];
}

generateFoodChoice();

function gameOver() {
    gameRunning = false;
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
    displayMessageAndRefresh();
    snakeArr = [{ x: 13, y: 15 }];
    musicSound.play();
    score = 0;
}

function displayMessageAndRefresh() {
    var messageElement = document.createElement("div");
    messageElement.id = "popup";
    messageElement.innerText = "Game Over";
    document.body.appendChild(messageElement);
    setTimeout(function () {
        location.reload();
    }, 2500);
}

function main(ctime) {
    musicSound.play();
    window.requestAnimationFrame(main);
    if (!gameRunning || (ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    if (snake[0].x >= 28 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOver();
    }
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodSound.play();
        if(currentFoodChoice == "watermelon")
            score+=2;
        else if(currentFoodChoice == "apple")
            score+=1;
        else
            score+=3;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        let c = 26;
        food = { x: Math.round(a + (c - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
        generateFoodChoice();
    }

    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
            if (inputDir.y === -1) {
                snakeElement.classList.add('up');
            } else if (inputDir.y === 1) {
                snakeElement.classList.add('down');
            } else if (inputDir.x === -1) {
                snakeElement.classList.add('left');
            } else if (inputDir.x === 1) {
                snakeElement.classList.add('right');
            }
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add(currentFoodChoice);
    board.appendChild(foodElement);
}

let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    if (!gameRunning) return;
    
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});
document.getElementById('easy').addEventListener('click', function() {
    speed = 8;
    restartGame();
});

document.getElementById('medium').addEventListener('click', function() {
    speed = 12; 
    restartGame();
});

document.getElementById('hard').addEventListener('click', function() {
    speed = 16;
    restartGame();
});

function restartGame() {
    gameRunning = true;
    inputDir = { x: 0, y: 0 };
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    generateFoodChoice();
    musicSound.play();
    lastPaintTime = 0;
    window.requestAnimationFrame(main);
}
