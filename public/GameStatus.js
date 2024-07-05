// export   function pacmanEatsDots(squares, pacmanCurrentIndex, eatDotsSound, score, scoreDisplay) {
    
//     if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) {
//       eatDotsSound.play();
//       score++;
//       scoreDisplay.innerHTML = `${score}`;
//       squares[pacmanCurrentIndex].classList.remove("pac-dot");
//     }
//   }


  


  export  function pacmanEatsDots(squares, pacmanCurrentIndex, eatDotsSound) {

    const scoreDisplay = document.getElementById("score");
    let score = scoreDisplay.innerHTML;
      console.log(score )
      if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) {
        eatDotsSound.play();
        score++;
        scoreDisplay.innerHTML = `${score}`;
        squares[pacmanCurrentIndex].classList.remove("pac-dot");
      }
    }



    export  function createBoard(layout, squares = []) {
      const grid = document.querySelector(".grid");

      for (let div = 0; div < layout.length; div++) {
        const square = document.createElement("div");
        square.id = div;
        grid.appendChild(square);
        squares.push(square);
  
        if (layout[div] === 0) {
         squares[div].classList.add("pac-dot");
        }
  
        if (layout[div] === 1) {
          squares[div].classList.add("wall");
        }
  
        if (layout[div] === 2) {
          squares[div].classList.add("ghost-lair");
        }
  
        if (layout[div] === 3) {
          squares[div].classList.add("big-dot");
        }
  
        if (layout[div] === 5) {
          squares[div].classList.add("topRightWall");
        }
  
        if (layout[div] === 6) {
          squares[div].classList.add("bottomRightWall");
        }
  
        if (layout[div] === 7) {
          squares[div].classList.add("radius");
        }
  
        if (layout[div] === 8) {
          squares[div].classList.add("topLeftWall");
        }
  
        if (layout[div] === 9) {
          squares[div].classList.add("bottomLeftWall");
        }
        if (layout[div] === 10) {
          squares[div].classList.add("leftWall");
        }
  
        if (layout[div] === 11) {
          squares[div].classList.add("rightWall");
        }
  
        if (layout[div] === 12) {
          squares[div].classList.add("wallRadius");
        }
        if (layout[div] === 13) {
          squares[div].classList.add("VCase");
        }
        if (layout[div] === 14) {
          squares[div].classList.add("VCase2");
        }
        if (layout[div] === 15) {
          squares[div].classList.add("VCase3");
        }
  
        if (layout[div] === 16) {
          squares[div].classList.add("wallRadiusBottom");
        }
        if (layout[div] === 17) {
          squares[div].classList.add("vider");
        }
        if (layout[div] === 18) {
          squares[div].classList.add("StartWall");
        }
      }
    }