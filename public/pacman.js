 export function pacmanEatsDots(squares, pacmanCurrentIndex, eatDotsSound, scoreDisplay, score,) {
  if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) {
    eatDotsSound.play();
    score++;
    scoreDisplay.innerHTML = `${score}`;
    squares[pacmanCurrentIndex].classList.remove("pac-dot");
  }
}
