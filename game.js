// ─── Constants ────────────────────────────────────────────────────────────────
const TILE = 20;
const COLS = 28;
const ROWS = 31;

const T = { WALL: 0, DOT: 1, EMPTY: 2, POWER: 3, GHOST_HOUSE: 4, DOOR: 5 };

const STATE = { READY: 'READY', PLAYING: 'PLAYING', DEAD: 'DEAD', LEVEL_COMPLETE: 'LEVEL_COMPLETE', GAME_OVER: 'GAME_OVER' };

const DIR = {
  LEFT:  { dx: -1, dy:  0 },
  RIGHT: { dx:  1, dy:  0 },
  UP:    { dx:  0, dy: -1 },
  DOWN:  { dx:  0, dy:  1 },
  NONE:  { dx:  0, dy:  0 },
};

const GHOST_SCATTER_CORNERS = [
  { col: 25, row: 0  },  // Blinky – top right
  { col:  2, row: 0  },  // Pinky  – top left
  { col: 27, row: 30 },  // Inky   – bottom right
  { col:  0, row: 30 },  // Clyde  – bottom left
];

const GHOST_COLORS   = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852'];
const GHOST_NAMES    = ['Blinky', 'Pinky', 'Inky', 'Clyde'];
const GHOST_RELEASE  = [0, 0, 30, 60]; // dots eaten before release

// ─── Maze Template ────────────────────────────────────────────────────────────
// 0=wall 1=dot 2=empty 3=power 4=ghost-house 5=door
// 28 columns × 31 rows
const MAZE_TEMPLATE = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,3,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,3,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
  [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,2,2,2,2,2,2,2,2,2,2,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,2,0,0,0,4,4,0,0,0,2,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,2,0,4,4,4,4,4,4,0,2,0,0,1,0,0,0,0,0,0],
  [2,2,2,2,2,2,1,2,2,2,0,4,4,4,4,4,4,0,2,2,2,1,2,2,2,2,2,2],
  [0,0,0,0,0,0,1,0,0,2,0,4,4,4,4,4,4,0,2,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,2,0,0,0,0,5,0,0,0,2,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,2,2,2,2,2,2,2,2,2,2,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,3,1,1,0,0,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,0,0,1,1,3,0],
  [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
  [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
  [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
  [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// ─── Game State ───────────────────────────────────────────────────────────────
const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');

let maze, dotsTotal, dotsEaten;
let score, highScore, lives, level;
let gameState;
let stateTimer;     // countdown for DEAD / LEVEL_COMPLETE / READY
let pacman;
let ghosts;
let scorePopups;    // [{x,y,text,timer}]
let powerTimer;     // frightened time remaining (ms)
let ghostEatCombo;  // 0-3 → 200/400/800/1600
let modeTimer;      // scatter/chase cycle timer
let modeIndex;      // current mode index
let lastTime;
let animFrame;

const MODE_CYCLE = [7000, 20000, 7000, 20000, 5000, 20000, 5000, Infinity];
// even indices = scatter, odd = chase

// ─── Maze Helpers ─────────────────────────────────────────────────────────────
function buildMaze() {
  maze = MAZE_TEMPLATE.map(row => [...row]);
  dotsTotal = 0;
  dotsEaten = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (maze[r][c] === T.DOT || maze[r][c] === T.POWER) dotsTotal++;
}

function tileAt(col, row) {
  if (row < 0 || row >= ROWS) return T.WALL;
  const c = ((col % COLS) + COLS) % COLS;
  return maze[row][c];
}

function isWalkable(col, row, forGhost) {
  const t = tileAt(col, row);
  if (t === T.WALL) return false;
  if (!forGhost && t === T.GHOST_HOUSE) return false;
  if (!forGhost && t === T.DOOR) return false;
  return true;
}

function pixelToTile(px, py) {
  return { col: Math.floor(px / TILE), row: Math.floor(py / TILE) };
}

function tileCenter(col, row) {
  return { x: col * TILE + TILE / 2, y: row * TILE + TILE / 2 };
}

// ─── Pacman ───────────────────────────────────────────────────────────────────
function createPacman() {
  const start = tileCenter(13, 23);
  return {
    x: start.x, y: start.y,
    dir: DIR.LEFT,
    nextDir: DIR.LEFT,
    speed: 2,
    mouthAngle: 0,
    mouthDir: 1,
    alive: true,
    deathFrame: 0,
  };
}

function updatePacman(dt) {
  const p = pacman;
  if (!p.alive) return;

  // Animate mouth
  p.mouthAngle += p.mouthDir * 4;
  if (p.mouthAngle >= 45) p.mouthDir = -1;
  if (p.mouthAngle <= 0)  p.mouthDir =  1;

  const speed = p.speed * (powerTimer > 0 ? 1 : 1);

  // Try to apply queued direction at tile centers
  const { col, row } = pixelToTile(p.x, p.y);
  const cx = col * TILE + TILE / 2;
  const cy = row * TILE + TILE / 2;

  // Snap threshold
  const snap = speed + 1;
  if (Math.abs(p.x - cx) < snap && Math.abs(p.y - cy) < snap) {
    // Try next direction
    const nd = p.nextDir;
    const nc = col + nd.dx;
    const nr = row + nd.dy;
    if (isWalkable(nc, nr, false)) {
      p.dir = nd;
      p.x = cx;
      p.y = cy;
    }
  }

  // Move
  const nx = p.x + p.dir.dx * speed;
  const ny = p.y + p.dir.dy * speed;

  // Tunnel wrap (row 14)
  const newCol = Math.floor(nx / TILE);
  const newRow = Math.floor(ny / TILE);

  if (isWalkable(newCol, newRow, false)) {
    p.x = nx;
    p.y = ny;
  }

  // Tunnel wrapping
  if (p.x < 0) p.x = COLS * TILE;
  if (p.x > COLS * TILE) p.x = 0;

  // Eat dots
  const tc = Math.round((p.x - TILE / 2) / TILE);
  const tr = Math.round((p.y - TILE / 2) / TILE);
  if (tr >= 0 && tr < ROWS && tc >= 0 && tc < COLS) {
    const tile = maze[tr][tc];
    if (tile === T.DOT) {
      maze[tr][tc] = T.EMPTY;
      score += 10;
      dotsEaten++;
      updateHUD();
    } else if (tile === T.POWER) {
      maze[tr][tc] = T.EMPTY;
      score += 50;
      dotsEaten++;
      powerTimer = 8000;
      ghostEatCombo = 0;
      ghosts.forEach(g => {
        if (g.mode !== 'EATEN' && g.mode !== 'HOUSE' && g.mode !== 'LEAVING') {
          g.mode = 'FRIGHTENED';
          // Reverse direction on fright start
          g.dir = { dx: -g.dir.dx, dy: -g.dir.dy };
        }
      });
      updateHUD();
    }
  }

  if (dotsEaten >= dotsTotal) {
    gameState = STATE.LEVEL_COMPLETE;
    stateTimer = 2000;
  }
}

// ─── Ghost ────────────────────────────────────────────────────────────────────
function createGhosts() {
  // Start positions inside ghost house
  const positions = [
    tileCenter(13, 11), // Blinky starts above house
    tileCenter(13, 14),
    tileCenter(11, 14),
    tileCenter(15, 14),
  ];
  return GHOST_NAMES.map((name, i) => ({
    name,
    color: GHOST_COLORS[i],
    x: positions[i].x,
    y: positions[i].y,
    dir: i % 2 === 0 ? DIR.LEFT : DIR.RIGHT,
    mode: i === 0 ? 'SCATTER' : 'HOUSE',
    speed: 1.8,
    frightTimer: 0,
    houseTimer: i * 2000, // stagger release
    bounceDir: 1,
    bounceY: positions[i].y,
  }));
}

function ghostTarget(ghost, i) {
  const pc = pixelToTile(pacman.x, pacman.y);
  if (ghost.mode === 'SCATTER') return GHOST_SCATTER_CORNERS[i];
  if (ghost.mode === 'FRIGHTENED') return null;
  if (ghost.mode === 'EATEN') return { col: 13, row: 11 };

  // Chase targets
  switch (i) {
    case 0: // Blinky: Pacman's tile
      return { col: pc.col, row: pc.row };
    case 1: { // Pinky: 4 ahead of Pacman
      const d = pacman.dir;
      let tc = pc.col + d.dx * 4;
      let tr = pc.row + d.dy * 4;
      if (d === DIR.UP) { tc -= 4; } // classic overflow bug
      return { col: tc, row: tr };
    }
    case 2: { // Inky: blinky-based
      const blinky = ghosts[0];
      const d = pacman.dir;
      let tc = pc.col + d.dx * 2;
      let tr = pc.row + d.dy * 2;
      if (d === DIR.UP) { tc -= 2; }
      const bc = pixelToTile(blinky.x, blinky.y);
      return { col: bc.col + (tc - bc.col) * 2, row: bc.row + (tr - bc.row) * 2 };
    }
    case 3: { // Clyde: chase if far, else scatter
      const dist = Math.hypot(ghost.x - pacman.x, ghost.y - pacman.y);
      if (dist > TILE * 8) return { col: pc.col, row: pc.row };
      return GHOST_SCATTER_CORNERS[3];
    }
  }
}

function ghostBestDir(ghost, target, forceReverse) {
  const { col, row } = pixelToTile(ghost.x, ghost.y);
  const dirs = [DIR.UP, DIR.LEFT, DIR.DOWN, DIR.RIGHT];
  const reverse = { dx: -ghost.dir.dx, dy: -ghost.dir.dy };

  let bestDir = null;
  let bestDist = Infinity;

  for (const d of dirs) {
    // Cannot reverse (unless forced)
    if (!forceReverse && d.dx === reverse.dx && d.dy === reverse.dy) continue;

    const nc = col + d.dx;
    const nr = row + d.dy;
    if (!isWalkable(nc, nr, true)) continue;
    // Ghosts can't go up through certain intersections (original rule - simplified here)

    if (target === null) {
      // Frightened: pick random valid direction (not reverse)
      if (bestDir === null || Math.random() < 0.5) bestDir = d;
    } else {
      const dist = Math.hypot(nc - target.col, nr - target.row);
      if (dist < bestDist) {
        bestDist = dist;
        bestDir = d;
      }
    }
  }
  return bestDir || ghost.dir;
}

function updateGhost(ghost, i, dt) {
  if (ghost.mode === 'HOUSE') {
    // Bounce vertically inside house
    const center = tileCenter(ghost.name === 'Inky' ? 11 : ghost.name === 'Clyde' ? 15 : 13, 14);
    ghost.y += ghost.bounceDir * 0.5;
    if (ghost.y > center.y + 6) ghost.bounceDir = -1;
    if (ghost.y < center.y - 6) ghost.bounceDir = 1;

    // Release logic based on dots eaten
    if (dotsEaten >= GHOST_RELEASE[i]) {
      ghost.mode = 'LEAVING';
    }
    return;
  }

  if (ghost.mode === 'LEAVING') {
    // Navigate to house exit (col 13, row 11)
    const exitX = tileCenter(13, 11).x;
    const exitY = tileCenter(13, 11).y;
    const doorX = tileCenter(13, 14).x;
    const doorY = tileCenter(13, 14).y - TILE;

    // Move up to exit
    if (Math.abs(ghost.x - doorX) > 1) {
      ghost.x += ghost.x < doorX ? 1 : -1;
    } else {
      ghost.x = doorX;
      ghost.y -= 1;
    }

    if (ghost.y <= exitY) {
      ghost.y = exitY;
      ghost.x = exitX;
      ghost.mode = isScatterMode() ? 'SCATTER' : 'CHASE';
      ghost.dir = DIR.LEFT;
    }
    return;
  }

  if (ghost.mode === 'EATEN') {
    ghost.speed = 3.6;
  } else if (ghost.mode === 'FRIGHTENED') {
    ghost.speed = 0.9;
  } else {
    ghost.speed = 1.8 + (level - 1) * 0.1;
  }

  // Move ghost toward its direction
  const { col, row } = pixelToTile(ghost.x, ghost.y);
  const cx = col * TILE + TILE / 2;
  const cy = row * TILE + TILE / 2;

  const snap = ghost.speed + 1;
  if (Math.abs(ghost.x - cx) < snap && Math.abs(ghost.y - cy) < snap) {
    ghost.x = cx;
    ghost.y = cy;
    // At tile center: decide next direction
    const target = ghostTarget(ghost, i);
    ghost.dir = ghostBestDir(ghost, target, false);

    // If EATEN and reached house, re-enter
    if (ghost.mode === 'EATEN' && col === 13 && row === 11) {
      ghost.mode = 'HOUSE';
      ghost.x = tileCenter(13, 14).x;
      ghost.y = tileCenter(13, 14).y;
      ghost.speed = 1.8;
    }
  }

  const nx = ghost.x + ghost.dir.dx * ghost.speed;
  const ny = ghost.y + ghost.dir.dy * ghost.speed;

  // Tunnel wrap
  if (nx < 0) { ghost.x = COLS * TILE; return; }
  if (nx > COLS * TILE) { ghost.x = 0; return; }

  const nc = Math.floor(nx / TILE);
  const nr = Math.floor(ny / TILE);
  if (isWalkable(nc, nr, true)) {
    ghost.x = nx;
    ghost.y = ny;
  } else {
    // Stuck: pick new direction
    const target = ghostTarget(ghost, i);
    ghost.dir = ghostBestDir(ghost, target, true);
  }
}

// ─── Mode Cycle ───────────────────────────────────────────────────────────────
function isScatterMode() {
  return modeIndex % 2 === 0;
}

function updateModeTimer(dt) {
  if (powerTimer > 0) return; // don't advance mode timer while frightened
  modeTimer -= dt;
  if (modeTimer <= 0) {
    modeIndex = Math.min(modeIndex + 1, MODE_CYCLE.length - 1);
    modeTimer = MODE_CYCLE[modeIndex];
    // Switch ghost modes and reverse direction
    const newMode = isScatterMode() ? 'SCATTER' : 'CHASE';
    ghosts.forEach(g => {
      if (g.mode === 'SCATTER' || g.mode === 'CHASE') {
        g.mode = newMode;
        g.dir = { dx: -g.dir.dx, dy: -g.dir.dy };
      }
    });
  }
}

function updatePowerTimer(dt) {
  if (powerTimer <= 0) return;
  powerTimer -= dt;
  if (powerTimer <= 0) {
    powerTimer = 0;
    ghosts.forEach(g => {
      if (g.mode === 'FRIGHTENED') {
        g.mode = isScatterMode() ? 'SCATTER' : 'CHASE';
      }
    });
  }
}

// ─── Collision ────────────────────────────────────────────────────────────────
function checkGhostCollisions() {
  ghosts.forEach((g, i) => {
    if (g.mode === 'EATEN' || g.mode === 'HOUSE' || g.mode === 'LEAVING') return;
    const dist = Math.hypot(g.x - pacman.x, g.y - pacman.y);
    if (dist < TILE * 0.8) {
      if (g.mode === 'FRIGHTENED') {
        g.mode = 'EATEN';
        const pts = [200, 400, 800, 1600][Math.min(ghostEatCombo, 3)];
        ghostEatCombo++;
        score += pts;
        scorePopups.push({ x: g.x, y: g.y, text: pts, timer: 1000 });
        updateHUD();
      } else {
        // Pacman dies
        pacman.alive = false;
        gameState = STATE.DEAD;
        stateTimer = 2000;
      }
    }
  });
}

// ─── HUD ──────────────────────────────────────────────────────────────────────
function updateHUD() {
  document.getElementById('score').textContent = score;
  document.getElementById('level').textContent = level;
  if (score > highScore) {
    highScore = score;
    document.getElementById('high-score').textContent = highScore;
  }

  const livesEl = document.getElementById('lives-icons');
  livesEl.innerHTML = '';
  for (let i = 0; i < lives; i++) {
    const c = document.createElement('canvas');
    c.width = 16; c.height = 16;
    const cx2 = c.getContext('2d');
    cx2.fillStyle = '#FFD700';
    cx2.beginPath();
    cx2.moveTo(8, 8);
    cx2.arc(8, 8, 7, 0.4, Math.PI * 2 - 0.4);
    cx2.closePath();
    cx2.fill();
    livesEl.appendChild(c);
  }
}

// ─── Rendering ────────────────────────────────────────────────────────────────
function drawMaze() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const t = maze[r][c];
      const x = c * TILE;
      const y = r * TILE;

      if (t === T.WALL) {
        ctx.fillStyle = '#1a1aff';
        ctx.fillRect(x, y, TILE, TILE);
        // Inner highlight
        ctx.strokeStyle = '#4a4aff';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 2, y + 2, TILE - 4, TILE - 4);
      } else if (t === T.DOT) {
        ctx.fillStyle = '#ffb8ae';
        ctx.beginPath();
        ctx.arc(x + TILE / 2, y + TILE / 2, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (t === T.POWER) {
        const pulse = Math.sin(Date.now() / 200) * 0.4 + 0.6;
        ctx.fillStyle = `rgba(255,184,174,${pulse})`;
        ctx.beginPath();
        ctx.arc(x + TILE / 2, y + TILE / 2, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (t === T.DOOR) {
        ctx.fillStyle = '#ffb8ff';
        ctx.fillRect(x + 2, y + TILE / 2 - 2, TILE - 4, 4);
      }
    }
  }
}

function drawPacman() {
  const p = pacman;
  if (!p.alive && gameState === STATE.DEAD) {
    // Death animation
    pacman.deathFrame += 3;
    const angle = Math.min(pacman.deathFrame * Math.PI / 180, Math.PI);
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.arc(p.x, p.y, TILE / 2 - 1, angle / 2, Math.PI * 2 - angle / 2);
    ctx.closePath();
    ctx.fill();
    return;
  }

  // Rotation based on direction
  let rotation = 0;
  if (p.dir === DIR.RIGHT) rotation = 0;
  else if (p.dir === DIR.LEFT) rotation = Math.PI;
  else if (p.dir === DIR.UP) rotation = -Math.PI / 2;
  else if (p.dir === DIR.DOWN) rotation = Math.PI / 2;

  const mouthRad = (p.mouthAngle * Math.PI) / 180;

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(rotation);
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, TILE / 2 - 1, mouthRad, Math.PI * 2 - mouthRad);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawGhost(ghost, i) {
  const x = ghost.x;
  const y = ghost.y;
  const r = TILE / 2 - 1;

  let bodyColor = ghost.color;
  let eyeWhite = '#fff';
  let pupilColor = '#00f';

  if (ghost.mode === 'FRIGHTENED') {
    const flash = powerTimer < 2000 && Math.floor(Date.now() / 250) % 2 === 0;
    bodyColor = flash ? '#fff' : '#0000ff';
    eyeWhite = flash ? '#000' : '#ffb8ff';
    pupilColor = flash ? '#000' : '#ffb8ff';
  } else if (ghost.mode === 'EATEN') {
    // Just eyes
    drawGhostEyes(x, y, ghost.dir, eyeWhite, '#00f');
    return;
  }

  ctx.save();
  ctx.translate(x, y);

  // Body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.arc(0, -2, r, Math.PI, 0);
  ctx.lineTo(r, r);

  // Wavy bottom
  const waves = 3;
  const waveW = (r * 2) / waves;
  for (let w = 0; w < waves; w++) {
    const wx = r - w * waveW;
    ctx.quadraticCurveTo(wx - waveW * 0.25, r + 4, wx - waveW * 0.5, r);
    ctx.quadraticCurveTo(wx - waveW * 0.75, r - 4, wx - waveW, r);
  }
  ctx.closePath();
  ctx.fill();

  // Eyes (skip for frightened flashing)
  if (ghost.mode !== 'FRIGHTENED') {
    drawGhostEyes(0, 0, ghost.dir, eyeWhite, pupilColor);
  } else {
    // Frightened face
    ctx.fillStyle = eyeWhite;
    ctx.beginPath(); ctx.arc(-4, -3, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(4, -3, 2, 0, Math.PI * 2); ctx.fill();
    // Zigzag mouth
    ctx.strokeStyle = eyeWhite;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-5, 3);
    for (let z = 0; z < 4; z++) {
      ctx.lineTo(-5 + z * 2.5 + 1.25, z % 2 === 0 ? 5 : 3);
    }
    ctx.stroke();
  }

  ctx.restore();
}

function drawGhostEyes(x, y, dir, white, pupil) {
  // White eye
  ctx.fillStyle = white;
  ctx.beginPath(); ctx.ellipse(x - 4, y - 3, 3, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 4, y - 3, 3, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  // Pupil offset by direction
  const pdx = dir.dx * 1.5;
  const pdy = dir.dy * 1.5;
  ctx.fillStyle = pupil;
  ctx.beginPath(); ctx.arc(x - 4 + pdx, y - 3 + pdy, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 4 + pdx, y - 3 + pdy, 1.5, 0, Math.PI * 2); ctx.fill();
}

function drawScorePopups() {
  scorePopups.forEach(p => {
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(p.text, p.x, p.y - (1000 - p.timer) / 50);
  });
}

function drawOverlay(text, sub) {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 20);

  if (sub) {
    ctx.fillStyle = '#fff';
    ctx.font = '14px monospace';
    ctx.fillText(sub, canvas.width / 2, canvas.height / 2 + 20);
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawMaze();
  ghosts.forEach((g, i) => drawGhost(g, i));
  drawPacman();
  drawScorePopups();

  if (gameState === STATE.READY) {
    drawOverlay('READY!', 'Press any key or tap to start');
  } else if (gameState === STATE.DEAD && stateTimer <= 0) {
    if (lives <= 0) {
      drawOverlay('GAME OVER', `Score: ${score}  Press any key to restart`);
    } else {
      drawOverlay('', '');
    }
  } else if (gameState === STATE.GAME_OVER) {
    drawOverlay('GAME OVER', `Score: ${score}  Press any key to restart`);
  } else if (gameState === STATE.LEVEL_COMPLETE && stateTimer > 0) {
    drawOverlay('LEVEL COMPLETE!', `Level ${level} cleared!`);
  }
}

// ─── Update ───────────────────────────────────────────────────────────────────
function update(dt) {
  if (gameState === STATE.READY) return;

  if (gameState === STATE.DEAD) {
    stateTimer -= dt;
    if (stateTimer <= 0) {
      if (lives <= 0) {
        gameState = STATE.GAME_OVER;
      } else {
        resetPositions();
        gameState = STATE.PLAYING;
      }
    }
    return;
  }

  if (gameState === STATE.LEVEL_COMPLETE) {
    stateTimer -= dt;
    if (stateTimer <= 0) {
      level++;
      startLevel();
    }
    return;
  }

  if (gameState === STATE.GAME_OVER) return;

  // PLAYING
  updateModeTimer(dt);
  updatePowerTimer(dt);
  updatePacman(dt);
  ghosts.forEach((g, i) => updateGhost(g, i, dt));
  checkGhostCollisions();

  // Update score popups
  scorePopups = scorePopups.filter(p => {
    p.timer -= dt;
    return p.timer > 0;
  });
}

// ─── Game Init ────────────────────────────────────────────────────────────────
function resetPositions() {
  pacman = createPacman();
  ghosts = createGhosts();
  powerTimer = 0;
  ghostEatCombo = 0;
  modeTimer = MODE_CYCLE[0];
  modeIndex = 0;
}

function startLevel() {
  buildMaze();
  resetPositions();
  scorePopups = [];
  gameState = STATE.PLAYING;
  updateHUD();
}

function initGame() {
  score = 0;
  lives = 3;
  level = 1;
  highScore = parseInt(localStorage.getItem('pacman_high') || '0');
  document.getElementById('high-score').textContent = highScore;
  scorePopups = [];
  buildMaze();
  resetPositions();
  gameState = STATE.READY;
  updateHUD();
}

// ─── Input ────────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (gameState === STATE.READY || gameState === STATE.GAME_OVER) {
    if (gameState === STATE.GAME_OVER) initGame();
    gameState = STATE.PLAYING;
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':  case 'a': pacman.nextDir = DIR.LEFT;  e.preventDefault(); break;
    case 'ArrowRight': case 'd': pacman.nextDir = DIR.RIGHT; e.preventDefault(); break;
    case 'ArrowUp':    case 'w': pacman.nextDir = DIR.UP;    e.preventDefault(); break;
    case 'ArrowDown':  case 's': pacman.nextDir = DIR.DOWN;  e.preventDefault(); break;
  }
});

// Touch support
let touchStartX = 0, touchStartY = 0;
canvas.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  if (gameState === STATE.READY || gameState === STATE.GAME_OVER) {
    if (gameState === STATE.GAME_OVER) initGame();
    gameState = STATE.PLAYING;
  }
}, { passive: true });

canvas.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy)) {
    pacman.nextDir = dx > 0 ? DIR.RIGHT : DIR.LEFT;
  } else {
    pacman.nextDir = dy > 0 ? DIR.DOWN : DIR.UP;
  }
}, { passive: true });

// ─── Game Loop ────────────────────────────────────────────────────────────────
function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = Math.min(timestamp - lastTime, 50);
  lastTime = timestamp;

  update(dt);
  render();

  // Save high score
  if (score > 0) localStorage.setItem('pacman_high', highScore);

  requestAnimationFrame(gameLoop);
}

// ─── Start ────────────────────────────────────────────────────────────────────
initGame();
requestAnimationFrame(gameLoop);
