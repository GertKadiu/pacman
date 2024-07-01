document.addEventListener("DOMContentLoaded", () => {
  const squares = document.querySelectorAll(".grid div");
  const scoreDisplay = document.getElementById("score");
  const livesDisplay = document.getElementById("lives");
  const startPauseButton = document.getElementById("start-pause-button");
  const modal = document.querySelector(".modal");
  const overlay = document.querySelector(".overlay");
  const width = 28;
  const eatDotsSound = new Audio("../public/Sound/waka.wav");
  const eatSound = new Audio("../public/Sound/power_dot.wav");
  const gameOverSound = new Audio("../public/Sound/gameOver.wav");
  const gameWin = new Audio("../public/Sound/gameWin.wav");
  let score = 0;
  let pacmanCurrentIndex = 349;
  let gameStarted = false;
  let gamePaused = false;
  let lives = 3;
  let intervalId;

  squares[pacmanCurrentIndex].classList.add("pacman-image");

  function movePacman(direction) {
    if (!gameStarted || gamePaused) return;
    squares[pacmanCurrentIndex].classList.remove(
      "pacman-image",
      "pacman-image-left",
      "pacman-image-up",
      "pacman-image-down"
    );

    function isWall(index) {
      return (
        squares[index].classList.contains("wall") ||
        squares[index].classList.contains("leftWall") ||
        squares[index].classList.contains("rightWall") ||
        squares[index].classList.contains("topLeftWall") ||
        squares[index].classList.contains("topRightWall") ||
        squares[index].classList.contains("bottomLeftWall") ||
        squares[index].classList.contains("bottomRightWall") ||
        squares[index].classList.contains("wallRadius") ||
        squares[index].classList.contains("wallRadiusBottom")
      );
    }

    switch (direction) {
      case "ArrowLeft":
        if (pacmanCurrentIndex - 1 && !isWall(pacmanCurrentIndex - 1)) {
          pacmanCurrentIndex -= 1;
          squares[pacmanCurrentIndex].classList.add("pacman-image-left");
        }
        if (pacmanCurrentIndex - 1 === 336) {
          squares[pacmanCurrentIndex].classList.remove("pacman-image-left");
          pacmanCurrentIndex = 363;
        }
        break;
      case "ArrowRight":
        if (pacmanCurrentIndex + 1 && !isWall(pacmanCurrentIndex + 1)) {
          pacmanCurrentIndex += 1;
          squares[pacmanCurrentIndex].classList.add("pacman-image");
        }
        if (pacmanCurrentIndex + 1 === 364) {
          squares[pacmanCurrentIndex].classList.remove("pacman-image");
          pacmanCurrentIndex = 336;
        }
        break;
      case "ArrowUp":
        if (pacmanCurrentIndex - width && !isWall(pacmanCurrentIndex - width)) {
          pacmanCurrentIndex -= width;
          squares[pacmanCurrentIndex].classList.add("pacman-image-up");
        }
        break;
      case "ArrowDown":
        if (pacmanCurrentIndex + width && !isWall(pacmanCurrentIndex + width)) {
          pacmanCurrentIndex += width;
          squares[pacmanCurrentIndex].classList.add("pacman-image-down");
        }
        break;
    }
    squares[pacmanCurrentIndex].classList.add("pacman-image");
    pacmanEatsDots();
    pacmanEatsBigDot();
    checkForGameOvers();
    checkForWin();
  }

  function startAutoMove(direction) {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => movePacman(direction), 160);
  }

  function handleKeyup(e) {
    startAutoMove(e.key);
  }

  function startGame() {
    gameStarted = true;
    squares[pacmanCurrentIndex].classList.add("pacman-image");

    gamePaused = false;
    document.addEventListener("keyup", handleKeyup);
    ghosts.forEach((ghost) => moveGhost(ghost));
    startPauseButton.textContent = "Pause Game";
  }

  function pauseGame() {
    gamePaused = true;
    ghosts.forEach((ghost) => clearInterval(ghost.timerId));
    document.removeEventListener("keyup", handleKeyup);
    if (intervalId) clearInterval(intervalId);
    startPauseButton.textContent = "Resume Game";
  }

  function resumeGame() {
    gamePaused = false;
    ghosts.forEach((ghost) => moveGhost(ghost));
    document.addEventListener("keyup", handleKeyup);
    startPauseButton.textContent = "Pause Game";
  }

  function toggleGame() {
    if (!gameStarted) {
      startGame();
    } else if (gamePaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  }

  startPauseButton.addEventListener("click", toggleGame);

  function pacmanEatsDots() {
    if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) {
      eatDotsSound.play();
      score++;
      scoreDisplay.innerHTML = `${score}`;
      squares[pacmanCurrentIndex].classList.remove("pac-dot");
    }
  }

  function pacmanEatsBigDot() {
    if (squares[pacmanCurrentIndex].classList.contains("big-dot")) {
      eatSound.play();
      score += 5;
      scoreDisplay.innerHTML = `${score}`;
      livesDisplay.innerHTML = `${lives}`;
      ghosts.forEach((ghost) => (ghost.isScared = true));
      setTimeout(unScareGhosts, 8000);
      squares[pacmanCurrentIndex].classList.remove("big-dot");
    }
  }

  function unScareGhosts() {
    ghosts.forEach((ghost) => (ghost.isScared = false));
  }

  class Ghost {
    constructor(className, startIndex, speed) {
      this.className = className;
      this.startIndex = startIndex;
      this.speed = speed;
      this.currentIndex = startIndex;
      this.isScared = false;
      this.timerId = NaN;
    }
  }

  const ghosts = [
    new Ghost("blinky", 622, 300),
    new Ghost("pinky", 623, 300),
    new Ghost("inky", 650, 300),
    new Ghost("clyde", 651, 300),
  ];

  ghosts.forEach((ghost) => {
    squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
  });

  function moveGhost(ghost) {
    if (gamePaused) return;
    const directions = [-1, 1, width, -width];
    let direction = directions[Math.floor(Math.random() * directions.length)];

    ghost.timerId = setInterval(function () {
      if (
        !squares[ghost.currentIndex + direction].classList.contains("ghost") &&
        !squares[ghost.currentIndex + direction].classList.contains("wall") &&
        !squares[ghost.currentIndex + direction].classList.contains("leftWall") &&
        !squares[ghost.currentIndex + direction].classList.contains("rightWall") &&
        !squares[ghost.currentIndex + direction].classList.contains("topLeftWall") &&
        !squares[ghost.currentIndex + direction].classList.contains("topRightWall") &&
        !squares[ghost.currentIndex + direction].classList.contains("bottomLeftWall") &&
        !squares[ghost.currentIndex + direction].classList.contains("bottomRightWall") &&
        !squares[ghost.currentIndex + direction].classList.contains("wallRadius") &&
        !squares[ghost.currentIndex + direction].classList.contains("wallRadiusBottom")
      ) {
        squares[ghost.currentIndex].classList.remove(
          ghost.className,
          "ghost",
          "scared-ghost"
        );
        ghost.currentIndex += direction;
        squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
      } else direction = directions[Math.floor(Math.random() * directions.length)];

      if (ghost.isScared) {
        squares[ghost.currentIndex].classList.add("scared-ghost");
      }

      if (
        ghost.isScared &&
        squares[ghost.currentIndex].classList.contains(
          "pacman-image",
          "pacman-image-left",
          "pacman-image-up",
          "pacman-image-down"
        )
      ) {
        ghost.isScared = true;
        squares[ghost.currentIndex].classList.remove(
          ghost.className,
          "ghost",
          "scared-ghost"
        );

        ghost.currentIndex = ghost.startIndex;
        score += 50;
        scoreDisplay.innerHTML = `Score: ${score}`;
        squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
      }
      checkForGameOvers();
    }, ghost.speed);
  }

  function checkForGameOvers() {
    if (
      squares[pacmanCurrentIndex].classList.contains("ghost") &&
      !squares[pacmanCurrentIndex].classList.contains("scared-ghost")
    ) {
      gameOverSound.play();
      eatDotsSound.pause();
      lives--;
      livesDisplay.innerHTML = `Lives: ${lives}`;
      if (lives === 0) {
        ghosts.forEach((ghost) => clearInterval(ghost.timerId));
        document.removeEventListener("keyup", handleKeyup);
        if (intervalId) clearInterval(intervalId);
        showModal("Game Over");
        startPauseButton.textContent = "Start Game";
        gameStarted = false;
        lives = 3;
        livesDisplay.innerHTML = `Lives: ${lives}`;
      } else {
        pauseGame();
        squares[pacmanCurrentIndex].classList.remove(
          "pacman-image",
          "pacman-image-left",
          "pacman-image-up",
          "pacman-image-down"
        );
        pacmanCurrentIndex = 349;
        squares[pacmanCurrentIndex].classList.add("pacman-image");

        startPauseButton.textContent = "Resume Game";
      }
    }
  }

  function restartGame() {
    score = 0;
    scoreDisplay.innerHTML = ` ${score}`;
    lives = 3;
    livesDisplay.innerHTML = `Lives: ${lives}`;
    pacmanCurrentIndex = 349;

    squares.forEach(square => {
      square.classList.remove(
        'pac-dot', 'big-dot', 'ghost', 'scared-ghost', 'inky','pinky', 'blinky','clyde',
        'pacman-image', 'pacman-image-left', 'pacman-image-up', 'pacman-image-down'
      );
    });
  
    
    squares.forEach(square => {
      if (square.classList.contains('pac-dot')) {
        square.classList.add('pac-dot');
      }
    });
  
    squares[pacmanCurrentIndex].classList.add('pacman-image');
  
    ghosts.forEach((ghost, index) => {
      ghost.currentIndex = ghost.startIndex;
      squares[ghost.currentIndex].classList.add(ghost.className, 'ghost');
    });

    ghost.currentIndex += direction;
        squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
  
    hideModal();
    startPauseButton.textContent = "Start Game";
    gameStarted = false;
  }
 
  document.getElementById('restartbtn').addEventListener('click', restartGame);
  

  function checkForWin() {
    if (score >= 200) {
      gameWin.play();
      eatDotsSound.pause();
      ghosts.forEach((ghost) => clearInterval(ghost.timerId));
      document.removeEventListener("keyup", handleKeyup);
      if (intervalId) clearInterval(intervalId);
      showModal("YOU WIN");
      startPauseButton.textContent = "Start Game";
      gameStarted = false;
      lives = 3;
      livesDisplay.innerHTML = `Lives: ${lives}`;
    }
  }

  function showModal(message) {
    modal.querySelector("h3").textContent = message;
    overlay.style.display = "flex";
  }

  function hideModal() {
    
    overlay.style.display = "none";
    gameWin.pause()
    score = 0;
    scoreDisplay.innerHTML = ` ${score}`;
   
    squares[pacmanCurrentIndex].classList.remove(
      "pacman-image",
      "pacman-image-left",
      "pacman-image-up",
      "pacman-image-down"
    );

    squares.forEach(square => {
      square.classList.remove(
        'ghost', 'scared-ghost', 'inky','pinky', 'blinky','clyde'
      );
    });
    pacmanCurrentIndex = 349;
    squares[pacmanCurrentIndex].classList.add("pacman-image");
  }

  modal.querySelector(".close-modal").addEventListener("click", hideModal);

  hideModal();
});
