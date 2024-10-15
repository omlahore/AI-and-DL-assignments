let puzzle = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // Initial puzzle state
let emptyTile = 0; // Represents the blank tile

const directions = {
  up: -3,
  down: 3,
  left: -1,
  right: 1
};

// Shuffle the puzzle
function shuffle() {
  for (let i = 0; i < 100; i++) {
    let randomDirection = Object.keys(directions)[Math.floor(Math.random() * 4)];
    moveTile(randomDirection);
  }
  updateUI();
}

// Update UI to reflect puzzle state
function updateUI() {
  puzzle.forEach((value, index) => {
    let tile = document.getElementById(`tile-${index}`);
    tile.innerText = value !== 0 ? value : '';
    tile.style.backgroundColor = value === 0 ? '#ecf0f1' : '#3498db';
  });
}

// Move tile in the given direction
function moveTile(direction) {
  let targetIndex = puzzle.indexOf(0) + directions[direction];

  if (isValidMove(targetIndex, direction)) {
    [puzzle[emptyTile], puzzle[targetIndex]] = [puzzle[targetIndex], puzzle[emptyTile]];
    emptyTile = targetIndex;
    updateUI();
  }
}

// Validate move based on boundaries and puzzle rules
function isValidMove(targetIndex, direction) {
  if (targetIndex < 0 || targetIndex > 8) return false;
  if ((emptyTile % 3 === 0 && direction === "left") || (emptyTile % 3 === 2 && direction === "right")) return false;
  return true;
}

// BFS Algorithm
function bfsSolve() {
  let visited = new Set();
  let queue = [{ state: puzzle.slice(), moves: [] }];

  while (queue.length > 0) {
    let { state, moves } = queue.shift();

    if (isGoal(state)) {
      animateMoves(moves);
      return;
    }

    visited.add(state.toString());

    for (let dir in directions) {
      let newState = moveState(state.slice(), dir);
      if (newState && !visited.has(newState.toString())) {
        queue.push({ state: newState, moves: [...moves, dir] });
      }
    }
  }
}

// Move state for BFS
function moveState(state, direction) {
  let emptyIndex = state.indexOf(0);
  let targetIndex = emptyIndex + directions[direction];

  if (isValidMoveBFS(emptyIndex, targetIndex, direction)) {
    [state[emptyIndex], state[targetIndex]] = [state[targetIndex], state[emptyIndex]];
    return state;
  }
  return null;
}

// Validate move for BFS
function isValidMoveBFS(emptyIndex, targetIndex, direction) {
  if (targetIndex < 0 || targetIndex > 8) return false;
  if ((emptyIndex % 3 === 0 && direction === "left") || (emptyIndex % 3 === 2 && direction === "right")) return false;
  return true;
}

// Check if current state matches the goal
function isGoal(state) {
  return state.toString() === "0,1,2,3,4,5,6,7,8";
}

// Animate the solution moves
function animateMoves(moves) {
  let i = 0;
  let interval = setInterval(() => {
    moveTile(moves[i]);
    i++;
    if (i === moves.length) clearInterval(interval);
  }, 500);
}

// Initialize puzzle on load
updateUI();
