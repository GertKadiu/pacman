// const startPauseButton = document.getElementById("start-pause-button");

// export function startGame(gamePaused,gameStarted, squares, pacmanCurrentIndex, ghosts, moveGhost, updateLivesDisplay, handleKeyup) {
//     gameStarted = true;
//     squares[pacmanCurrentIndex].classList.add("pacman-image");

//     gamePaused = false;
//     document.addEventListener("keyup", handleKeyup);
//     ghosts.forEach((ghost) => {
//       ghost.currentIndex = ghost.startIndex;
//       squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
//       moveGhost(ghost);
//     });
//     startPauseButton.textContent = "Pause Game";
//     updateLivesDisplay(); 
//   }

//   export function pauseGame(gamePaused, ghosts, timerId, handleKeyup, intervalId) {
//     gamePaused = true;
//     ghosts.forEach((ghost) => clearInterval(ghost.timerId));
//     document.removeEventListener("keyup", handleKeyup);
//     if (intervalId) clearInterval(intervalId);
//     startPauseButton.textContent = "Resume Game";
//   }

//   export function resumeGame(gamePaused, ghosts, moveGhost, handleKeyup) {
//     gamePaused = false;
//     ghosts.forEach((ghost) => moveGhost(ghost));
//     document.addEventListener("keyup", handleKeyup);
//     startPauseButton.textContent = "Pause Game";
//   }

//   export function startAutoMove(direction) {
//     if (intervalId) clearInterval(intervalId);
//     intervalId = setInterval(() => movePacman(direction), 150);
//   }

//   export function handleKeyup(e) {
//     startAutoMove(e.key);
//   }
  