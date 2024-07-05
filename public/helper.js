// helpers.js
import { squares, width, livesDisplay, modal, overlay } from './Constants.js';
import { pacmanCurrentIndex, movePacman } from './pacman.js';

export function createBoard(layout) {
  layout.forEach((item, i) => {
    const square = document.createElement("div");
    squares.appendChild(square);
    if (item === 0) {
      square.classList.add("dots");
    } else if (item === 1) {
      square.classList.add("wall");
    } else if (item === 2) {
      square.classList.add("big-dot");
    } else if (item === 3) {
      square.classList.add("empty");
    }
  });
}

export function updateLivesDisplay() {
  livesDisplay.textContent = `Lives: ${lives}`;
}

export function showModal(title, text) {
  modal.querySelector("h2").textContent = title;
  modal.querySelector("p").textContent = text;
  modal.classList.add("show");
  overlay.classList.add("show");
}

export function hideModal() {
  modal.classList.remove("show");
  overlay.classList.remove("show");
}
