// ghosts.js
import { squares, width } from './Constants.js'
import { pacmanCurrentIndex, movePacman } from './pacman.js'
import { checkForGameOvers, getDirectionTowardsPacman } from './game.js';

export class Ghost {
  constructor(className, startIndex, speed) {
    this.className = className;
    this.startIndex = startIndex;
    this.speed = speed;
    this.currentIndex = startIndex;
    this.isScared = false;
    this.timerId = NaN;
  }
}

export const ghosts = [
  new Ghost("blinky", 172, 250),
  new Ghost("pinky", 171, 250),
  new Ghost("inky", 199, 250),
  new Ghost("clyde", 200, 250),
];

ghosts.forEach((ghost) => {
  squares[ghost.startIndex].classList.add(ghost.className, "ghost");
});

export function moveGhost(ghost) {
  if (gamePaused) return;

  const directions = [-1, +1, -width, +width];
  let direction = directions[Math.floor(Math.random() * directions.length)];

  ghost.timerId = setInterval(function () {
    if (
      !squares[ghost.currentIndex + direction].classList.contains("wall") &&
      !squares[ghost.currentIndex + direction].classList.contains("ghost") && 
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
        squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
      } else {
        checkForGameOvers();
      }
    }

    if(!ghost.isScared){
      const newDirection = getDirectionTowardsPacman(ghost.currentIndex);
      if (newDirection !== null) {
        direction = newDirection;
      }
    }
  }, ghost.speed);
}
