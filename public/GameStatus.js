export function checkForGameOvers(squares, pacmanCurrentIndex, gameOverSound, eatDotsSound, lives, livesDisplay, ghosts, pauseGame, startPauseButton) {
  if (
    squares[pacmanCurrentIndex].classList.contains("ghost") &&
    !squares[pacmanCurrentIndex].classList.contains("scared-ghost")
  ) {
    gameOverSound.play()
    eatDotsSound.pause();
    lives--;
    livesDisplay.innerHTML = `Lives: ${lives}`;
    if (lives === 0) {
      ghosts.forEach((ghost) => clearInterval(ghost.timerId));
      document.removeEventListener("keyup", handleKeyup);
      if (intervalId) clearInterval(intervalId);
      setTimeout(function () {
        alert("Game Over");
      }, 500);
      startPauseButton.textContent = "Start Game";
      gameStarted = false;
      lives = 3;
      livesDisplay.innerHTML = `Lives: ${lives}`;
    } else {
      pauseGame();

      // squares[pacmanCurrentIndex].removeChild(image);
      squares[pacmanCurrentIndex].classList.remove('pacman-image')
      pacmanCurrentIndex = 349;
      // squares[pacmanCurrentIndex].appendChild(image);
      squares[pacmanCurrentIndex].classList.add('pacman-image')

      startPauseButton.textContent = "Resume Game";

      return pacmanCurrentIndex
    }
  }
}



