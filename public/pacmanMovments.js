import layout from "./Matrix.js";

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
  let pacmanCurrentIndex = 321;
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
        if (pacmanCurrentIndex - 1 === 307) {
          squares[pacmanCurrentIndex].classList.remove("pacman-image-left");
          pacmanCurrentIndex = 335;
        }
        break;
      case "ArrowRight":
        if (pacmanCurrentIndex + 1 && !isWall(pacmanCurrentIndex + 1)) {
          pacmanCurrentIndex += 1;
          squares[pacmanCurrentIndex].classList.add("pacman-image");
        }
        if (pacmanCurrentIndex + 1 === 336) {
          squares[pacmanCurrentIndex].classList.remove("pacman-image");
          pacmanCurrentIndex = 309;
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
    ghosts.forEach((ghost) => {
      ghost.currentIndex = ghost.startIndex;
      squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
      moveGhost(ghost);
    });
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

  function unScareGhosts() {
    ghosts.forEach((ghost) => {
      ghost.isScared = false;
      squares[ghost.currentIndex].classList.remove("scared-ghost");
    });
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
    new Ghost("blinky", 566, 300),
    new Ghost("pinky", 594, 300),
    new Ghost("inky", 567, 300),
    new Ghost("clyde", 595, 300),
  ];


  ghosts.forEach((ghost) => {
    squares[ghost.startIndex].classList.add(ghost.className, "ghost");
  });

  function pacmanEatsBigDot() {
    if (squares[pacmanCurrentIndex].classList.contains("big-dot")) {
      eatSound.play();
      score += 20;
      scoreDisplay.innerHTML = `${score}`;
      ghosts.forEach((ghost) => (ghost.isScared = true));
      setTimeout(unScareGhosts, 8000);
      squares[pacmanCurrentIndex].classList.remove("big-dot");
    }
  }

  function moveGhost(ghost) {
    if (gamePaused) return;

    const directions = [-1, +1, -width, +width];
    let direction = directions[Math.floor(Math.random() * directions.length)];

    ghost.timerId = setInterval(function () {
      if (
        !squares[ghost.currentIndex + direction].classList.contains("wall") &&
        !squares[ghost.currentIndex + direction].classList.contains("ghost")
      ) {
        squares[ghost.currentIndex].classList.remove(
          ghost.className,
          "ghost",
          "scared-ghost"
        );

        ghost.currentIndex += direction;

        squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
      } else {
        direction = directions[Math.floor(Math.random() * directions.length)];
      }

      if (ghost.isScared) {
        squares[ghost.currentIndex].classList.add("scared-ghost");
      }

      if (ghost.currentIndex === pacmanCurrentIndex) {
        if (ghost.isScared) {
          squares[ghost.currentIndex].classList.remove(
            ghost.className,
            "ghost",
            "scared-ghost"
          );
          ghost.currentIndex = ghost.startIndex;
          score += 100;
          squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
        } else {
          checkForGameOvers();
        }
      }

      const newDirection = getDirectionTowardsPacman(ghost.currentIndex);
      if (newDirection !== null) {
        direction = newDirection;
      }
    }, ghost.speed);
  }

  function getDirectionTowardsPacman(ghostIndex) {
    const ghostX = ghostIndex % width;
    const ghostY = Math.floor(ghostIndex / width);
    const pacmanX = pacmanCurrentIndex % width;
    const pacmanY = Math.floor(pacmanCurrentIndex / width);

    const directions = [];

    if (
      pacmanX < ghostX &&
      !squares[ghostIndex - 1].classList.contains("ghost") &&
      !squares[ghostIndex - 1].classList.contains("wall") &&
      !squares[ghostIndex - 1].classList.contains("leftWall") &&
      !squares[ghostIndex - 1].classList.contains("rightWall") &&
      !squares[ghostIndex - 1].classList.contains("topLeftWall") &&
      !squares[ghostIndex - 1].classList.contains("topRightWall") &&
      !squares[ghostIndex - 1].classList.contains("bottomLeftWall") &&
      !squares[ghostIndex - 1].classList.contains("bottomRightWall") &&
      !squares[ghostIndex - 1].classList.contains("wallRadius") &&
      !squares[ghostIndex - 1].classList.contains("wallRadiusBottom")
      
    ) {
      directions.push(-1);
    }
    if (
      pacmanX > ghostX &&
      !squares[ghostIndex + 1].classList.contains("ghost") &&
      !squares[ghostIndex + 1].classList.contains("wall") &&
      !squares[ghostIndex + 1].classList.contains("leftWall") &&
      !squares[ghostIndex + 1].classList.contains("rightWall") &&
      !squares[ghostIndex + 1].classList.contains("topLeftWall") &&
      !squares[ghostIndex + 1].classList.contains("topRightWall") &&
      !squares[ghostIndex + 1].classList.contains("bottomLeftWall") &&
      !squares[ghostIndex + 1].classList.contains("bottomRightWall") &&
      !squares[ghostIndex + 1].classList.contains("wallRadius") &&
      !squares[ghostIndex + 1].classList.contains("wallRadiusBottom")
    ) {
      directions.push(1);
    }
    if (
      pacmanY < ghostY &&
      !squares[ghostIndex - width].classList.contains("ghost") &&
      !squares[ghostIndex - width].classList.contains("wall") &&
      !squares[ghostIndex - width].classList.contains("leftWall") &&
      !squares[ghostIndex - width].classList.contains("rightWall") &&
      !squares[ghostIndex - width].classList.contains("topLeftWall") &&
      !squares[ghostIndex - width].classList.contains("topRightWall") &&
      !squares[ghostIndex - width].classList.contains("bottomLeftWall") &&
      !squares[ghostIndex - width].classList.contains("bottomRightWall") &&
      !squares[ghostIndex - width].classList.contains("wallRadius") &&
      !squares[ghostIndex - width].classList.contains("wallRadiusBottom")
    ) {
      directions.push(-width);
    }
    if (
      pacmanY > ghostY &&
      !squares[ghostIndex + width].classList.contains("ghost") &&
      !squares[ghostIndex + width].classList.contains("wall") &&
      !squares[ghostIndex + width].classList.contains("leftWall") &&
      !squares[ghostIndex + width].classList.contains("rightWall") &&
      !squares[ghostIndex + width].classList.contains("topLeftWall") &&
      !squares[ghostIndex + width].classList.contains("topRightWall") &&
      !squares[ghostIndex + width].classList.contains("bottomLeftWall") &&
      !squares[ghostIndex + width].classList.contains("bottomRightWall") &&
      !squares[ghostIndex + width].classList.contains("wallRadius") &&
      !squares[ghostIndex + width].classList.contains("wallRadiusBottom")
    ) {
      directions.push(width);
    }

    if (directions.length > 0) {
      return directions[Math.floor(Math.random() * directions.length)];
    }

    return null;
  }

  function restartGame() {
    score = 0;
    scoreDisplay.innerHTML = `${score}`;
    lives = 3;
    livesDisplay.innerHTML = `Lives: ${lives}`;
    pacmanCurrentIndex = 321;

    squares.forEach((square) => {
      square.classList.remove(
        "big-dot",
        "ghost",
        "scared-ghost",
        "inky",
        "pinky",
        "blinky",
        "clyde",
        "pacman-image",
        "pacman-image-left",
        "pacman-image-up",
        "pacman-image-down",
        "pac-dot"
      );
    });

    squares[pacmanCurrentIndex].classList.add("pacman-image");

    ghosts.forEach((ghost) => {
      ghost.currentIndex = ghost.startIndex;
      squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
    });
    ghosts.forEach((ghost) => clearInterval(ghost.timerId));

    createBoard();

    gameStarted = false;
    startPauseButton.textContent = "Start Game";

    hideModal();
  }

  document.getElementById("close-modal").addEventListener("click", restartGame);
  document.getElementById("restartbtn").addEventListener("click", restartGame);

  function createBoard() {
    squares.forEach((square, index) => {
      square.className = "";
      if (layout[index] === 0) {
        squares[index].classList.add("pac-dot");
      }

      if (layout[index] === 1) {
        squares[index].classList.add("wall");
      }

      if (layout[index] === 2) {
        squares[index].classList.add("ghost-lair");
      }

      if (layout[index] === 3) {
        squares[index].classList.add("big-dot");
      }

      if (layout[index] === 5) {
        squares[index].classList.add("topRightWall");
      }

      if (layout[index] === 6) {
        squares[index].classList.add("bottomRightWall");
      }

      if (layout[index] === 7) {
        squares[index].classList.add("radius");
      }

      if (layout[index] === 8) {
        squares[index].classList.add("topLeftWall");
      }

      if (layout[index] === 9) {
        squares[index].classList.add("bottomLeftWall");
      }
      if (layout[index] === 10) {
        squares[index].classList.add("leftWall");
      }

      if (layout[index] === 11) {
        squares[index].classList.add("rightWall");
      }

      if (layout[index] === 12) {
        squares[index].classList.add("wallRadius");
      }
      if (layout[index] === 13) {
        squares[index].classList.add("VCase");
      }
      if (layout[index] === 14) {
        squares[index].classList.add("VCase2");
      }
      if (layout[index] === 15) {
        squares[index].classList.add("VCase3");
      }

      if (layout[index] === 16) {
        squares[index].classList.add("wallRadiusBottom");
      }
      if (layout[index] === 17) {
        squares[index].classList.add("vider");
      }
    });
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
        pacmanCurrentIndex = 321;
        squares[pacmanCurrentIndex].classList.add("pacman-image");

        startPauseButton.textContent = "Resume Game";
      }
    }
  }

  function checkForWin() {
    if (score >= 300) {
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
    gameWin.pause();
    score = 0;
    scoreDisplay.innerHTML = ` ${score}`;
    squares[pacmanCurrentIndex].classList.remove(
      "pacman-image",
      "pacman-image-left",
      "pacman-image-up",
      "pacman-image-down"
    );
    pacmanCurrentIndex = 321;
    squares[pacmanCurrentIndex].classList.add("pacman-image");
  }

  modal.querySelector(".close-modal").addEventListener("click", hideModal);

  hideModal();
});
