const scoreDisplay = document.getElementById("score");
let score = scoreDisplay.innerHTML;

export function pacmanEatsDots(squares, pacmanCurrentIndex, eatDotsSound) {
  if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) {
    eatDotsSound.play();
    score++;
    scoreDisplay.innerHTML = `${score}`;
    squares[pacmanCurrentIndex].classList.remove("pac-dot");
  }
}

export function pacmanEatsBigDot(
  squares,
  eatSound,
  pacmanCurrentIndex,
  ghosts,
  unScareGhosts
) {
  if (squares[pacmanCurrentIndex].classList.contains("big-dot")) {
    eatSound.play();
    score += 20;
    scoreDisplay.innerHTML = `${score}`;
    ghosts.forEach((ghost) => (ghost.isScared = true));
    setTimeout(unScareGhosts, 8000);
    squares[pacmanCurrentIndex].classList.remove("big-dot");
  }
}


