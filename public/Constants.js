// constants.js

export const width = 28;
export const eatDotsSound = new Audio("./Sound/waka.wav");
export const eatSound = new Audio("./Sound/power_dot.wav");
export const gameOverSound = new Audio("./Sound/gameOver.wav");
export const gameWin = new Audio("./Sound/gameWin.wav");

export let score = 0;
export let pacmanCurrentIndex = 321;
export let gameStarted = false;
export let gamePaused = false;
export let lives = 3;
export let intervalId;


