// main.js
import { createBoard } from './helpers.js';
import { restartGame } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
  createBoard(layout);
  restartGame();
});
