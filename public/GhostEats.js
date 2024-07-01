export function pacmanEatsDots(squares, pacmanCurrentIndex, score, scoreDisplay, eatDotsSound) {
  if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) {
    eatDotsSound.play()
    score++;
    scoreDisplay.innerHTML = `Score: ${score}`;
    squares[pacmanCurrentIndex].classList.remove("pac-dot");
  }
}