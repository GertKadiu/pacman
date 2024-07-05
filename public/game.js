




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
  intervalId = setInterval(() => movePacman(direction), 150);
}

function handleKeyup(e) {
  startAutoMove(e.key);
}

upButton.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startAutoMove('ArrowUp');
});

leftButton.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startAutoMove('ArrowLeft');
});

rightButton.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startAutoMove('ArrowRight');
});

downButton.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startAutoMove('ArrowDown');
});

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
  updateLivesDisplay(); 
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