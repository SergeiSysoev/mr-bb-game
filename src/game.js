import * as LJS from '../vendor/littlejs.esm.min.js';
import {
  collectDuct,
  createGameState,
  startRun,
  takeFallHit,
  takeMasticHit,
} from './game-logic.js';
import {
  getGameCanvasSize,
  isPhoneLandscapeViewport,
  isPhonePortraitViewport,
} from './viewport.js';

const { vec2, rgb } = LJS;

const TOTAL_DUCTS = 10;
const LEVEL_WIDTH = 54;
const PLAYER_START = vec2(2.2, 2.1);
const HERO_SOURCE = new URL('../assets/mr-bb.png', import.meta.url).href;
const GAMEPLAY_SCROLL_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space']);

const colors = {
  deep: rgb(0.035, 0.07, 0.09),
  wallTop: rgb(0.14, 0.22, 0.27),
  wallBottom: rgb(0.055, 0.09, 0.12),
  beam: rgb(0.20, 0.28, 0.32),
  beamEdge: rgb(0.34, 0.43, 0.47),
  slab: rgb(0.18, 0.21, 0.22),
  slabEdge: rgb(0.39, 0.44, 0.45),
  safety: rgb(1, 0.66, 0.02),
  steel: rgb(0.71, 0.78, 0.81),
  steelLight: rgb(0.92, 0.96, 0.97),
  steelDark: rgb(0.35, 0.42, 0.45),
  orange: rgb(0.98, 0.28, 0.05),
  bucket: rgb(0.20, 0.23, 0.24),
  bucketEdge: rgb(0.72, 0.76, 0.77),
};

const scoreValue = document.querySelector('#score-value');
const ductValue = document.querySelector('#duct-value');
const livesValue = document.querySelector('#lives-value');
const overlay = document.querySelector('#game-overlay');
const overlayTitle = document.querySelector('#overlay-title');
const overlayCopy = document.querySelector('#overlay-copy');
const overlayAction = document.querySelector('#overlay-action');
const restartButtons = document.querySelectorAll('[data-action="restart"]');
const stageRestartButton = document.querySelector('#stage-restart-button');
const announcement = document.querySelector('#game-announcement');
const gameStage = document.querySelector('#game-stage');
const touchControls = document.querySelector('.touch-controls');
const gameFooter = document.querySelector('.game-footer');
const page = document.querySelector('.page');
const orientationGate = document.querySelector('#orientation-gate');
const portraitContinue = document.querySelector('#portrait-continue');

let gameState = createGameState(TOTAL_DUCTS);
let player;
let heroTile;
let engineReady = false;
let announcementTimer;
let portraitOverride = false;
let viewportSyncFrame = 0;
let lastCanvasSize = '';

const pointerControls = {
  left: new Set(),
  right: new Set(),
  jump: new Set(),
  jumpQueued: false,
};

function formatScore(score) {
  return String(score).padStart(4, '0');
}

function updateHud() {
  scoreValue.textContent = formatScore(gameState.score);
  ductValue.textContent = `${gameState.collectedDucts} / ${gameState.totalDucts}`;
  livesValue.textContent = gameState.lives ? Array(gameState.lives).fill('●').join(' ') : '—';
  livesValue.setAttribute('aria-label', `${gameState.lives} hard hats`);
}

function announce(message) {
  window.clearTimeout(announcementTimer);
  announcement.textContent = '';
  requestAnimationFrame(() => {
    announcement.textContent = message;
  });
  announcementTimer = window.setTimeout(() => {
    announcement.textContent = '';
  }, 2200);
}

function showOverlay(title, copy, actionLabel) {
  overlayTitle.textContent = title;
  overlayCopy.textContent = copy;
  overlayAction.textContent = actionLabel;
  overlay.removeAttribute('aria-hidden');
  touchControls.inert = true;
  gameFooter.inert = true;
  stageRestartButton.inert = true;
  overlay.classList.remove('is-hidden');
  overlayAction.focus({ preventScroll: true });
}

function hideOverlay() {
  overlay.classList.add('is-hidden');
  overlay.setAttribute('aria-hidden', 'true');
  touchControls.inert = false;
  gameFooter.inert = false;
  stageRestartButton.inert = false;
}

function clearPointerControls() {
  for (const key of ['left', 'right', 'jump']) {
    pointerControls[key].clear();
  }
  pointerControls.jumpQueued = false;
  document.querySelectorAll('.touch-button').forEach((button) => button.classList.remove('is-pressed'));
}

function getViewportDimensions() {
  const viewport = window.visualViewport;
  return {
    width: viewport?.width || window.innerWidth,
    height: viewport?.height || window.innerHeight,
  };
}

function hasCoarsePointer() {
  return window.matchMedia('(pointer: coarse)').matches;
}

function syncOrientationGate(width, height, coarsePointer) {
  const isPhoneLandscape = isPhoneLandscapeViewport(width, height, coarsePointer);
  if (isPhoneLandscape) {
    portraitOverride = false;
  }

  const shouldShowGate =
    isPhonePortraitViewport(width, height, coarsePointer) && !portraitOverride;
  const gateWasVisible = !orientationGate.hidden;

  orientationGate.hidden = !shouldShowGate;
  orientationGate.setAttribute('aria-hidden', String(!shouldShowGate));
  page.inert = shouldShowGate;

  if (shouldShowGate) {
    page.setAttribute('aria-hidden', 'true');
    clearPointerControls();
    if (!gateWasVisible) {
      requestAnimationFrame(() => portraitContinue.focus({ preventScroll: true }));
    }
  } else {
    page.removeAttribute('aria-hidden');
    if (gateWasVisible && engineReady) {
      requestAnimationFrame(() => {
        const focusTarget = overlay.classList.contains('is-hidden') ? gameStage : overlayAction;
        focusTarget.focus({ preventScroll: true });
      });
    }
  }

  LJS.setPaused(document.hidden || shouldShowGate);
}

function syncViewportLayout() {
  const { width, height } = getViewportDimensions();
  const coarsePointer = hasCoarsePointer();
  const canvasSize = getGameCanvasSize(width, height, coarsePointer);
  const nextCanvasSize = `${canvasSize.width}x${canvasSize.height}`;

  if (nextCanvasSize !== lastCanvasSize) {
    lastCanvasSize = nextCanvasSize;
    LJS.setCanvasFixedSize(vec2(canvasSize.width, canvasSize.height));
  }

  syncOrientationGate(width, height, coarsePointer);
}

function scheduleViewportSync() {
  cancelAnimationFrame(viewportSyncFrame);
  viewportSyncFrame = requestAnimationFrame(syncViewportLayout);
}

function controlIsDown(name) {
  return pointerControls[name].size > 0;
}

function inputDirection() {
  const left = LJS.keyIsDown('ArrowLeft') || LJS.keyIsDown('KeyA') || controlIsDown('left');
  const right = LJS.keyIsDown('ArrowRight') || LJS.keyIsDown('KeyD') || controlIsDown('right');
  return Number(right) - Number(left);
}

function jumpWasPressed() {
  const pressed =
    LJS.keyWasPressed('ArrowUp') ||
    LJS.keyWasPressed('KeyW') ||
    LJS.keyWasPressed('Space') ||
    pointerControls.jumpQueued;
  pointerControls.jumpQueued = false;
  return pressed;
}

function jumpIsDown() {
  return (
    LJS.keyIsDown('ArrowUp') ||
    LJS.keyIsDown('KeyW') ||
    LJS.keyIsDown('Space') ||
    controlIsDown('jump')
  );
}

class Platform extends LJS.EngineObject {
  constructor(pos, size, raised = false) {
    super(pos, size);
    this.mass = 0;
    this.raised = raised;
    this.renderOrder = 2;
    this.setCollision(true, true, false);
  }

  render() {
    LJS.drawRect(this.pos, this.size, colors.slab);
    const top = this.pos.add(vec2(0, this.size.y / 2 - 0.08));
    LJS.drawRect(top, vec2(this.size.x, 0.16), this.raised ? colors.safety : colors.slabEdge);

    if (this.raised) {
      const count = Math.max(2, Math.floor(this.size.x));
      for (let index = 0; index < count; index += 1) {
        const x = this.pos.x - this.size.x / 2 + ((index + 0.5) * this.size.x) / count;
        LJS.drawCircle(vec2(x, this.pos.y), 0.11, colors.beamEdge);
      }
    }
  }
}

class DuctSection extends LJS.EngineObject {
  constructor(pos) {
    super(pos, vec2(0.85, 0.72));
    this.mass = 0;
    this.renderOrder = 12;
  }

  update() {
    if (gameState.status !== 'playing' || !player || !this.isOverlappingObject(player)) {
      return;
    }

    gameState = collectDuct(gameState);
    this.destroy();
    updateHud();

    if (gameState.status === 'won') {
      announce('All duct sections collected. Job complete.');
      showOverlay(
        'DUCT RUN COMPLETE!',
        `Mr. BB secured all ${gameState.totalDucts} duct sections with ${gameState.score} points.`,
        'RUN IT AGAIN',
      );
    } else {
      announce(`Duct secured. ${gameState.collectedDucts} of ${gameState.totalDucts}.`);
    }
  }

  render() {
    const pulse = 1 + Math.sin(LJS.time * 5 + this.pos.x) * 0.06;
    const size = vec2(this.size.x * pulse, this.size.y);
    LJS.drawRect(this.pos, size, colors.steel, 0.08);
    LJS.drawRect(this.pos.add(vec2(0, 0.15)), vec2(size.x * 0.9, 0.16), colors.steelLight, 0.08);
    LJS.drawRect(this.pos.add(vec2(-size.x * 0.42, 0)), vec2(0.12, size.y * 1.08), colors.steelDark, 0.08);
    LJS.drawRect(this.pos.add(vec2(size.x * 0.42, 0)), vec2(0.12, size.y * 1.08), colors.steelDark, 0.08);
    LJS.drawCircle(this.pos.add(vec2(0.23, -0.12)), 0.06, colors.steelDark);
    LJS.drawCircle(this.pos.add(vec2(-0.23, -0.12)), 0.06, colors.steelDark);
  }
}

class MasticBucket extends LJS.EngineObject {
  constructor(pos) {
    super(pos, vec2(0.8, 0.85));
    this.startPos = pos.copy();
    this.mass = 0;
    this.gravityScale = 0;
    this.renderOrder = 13;
    this.active = false;
    this.cooldownFrames = 0;
    this.setCollision(true, false, false);
  }

  reset() {
    this.pos = this.startPos.copy();
    this.velocity = vec2();
    this.angle = 0;
    this.angleVelocity = 0;
    this.mass = 0;
    this.gravityScale = 0;
    this.active = false;
    this.groundObject = 0;
    this.cooldownFrames = 80;
  }

  update() {
    if (gameState.status !== 'playing' || !player) {
      return;
    }

    if (this.cooldownFrames > 0) {
      this.cooldownFrames -= 1;
      return;
    }

    if (!this.active && Math.abs(player.pos.x - this.pos.x) < 2.7) {
      this.active = true;
      this.mass = 1;
      this.gravityScale = 1.45;
      this.angleVelocity = 0.035;
    }

    if (!this.active) {
      return;
    }

    if (this.isOverlappingObject(player)) {
      player.takeMasticHit(this);
      this.reset();
      return;
    }

    if (this.groundObject || this.pos.y < -2) {
      this.reset();
    }
  }

  render() {
    const points = [
      vec2(-0.36, 0.3),
      vec2(0.36, 0.3),
      vec2(0.28, -0.35),
      vec2(-0.28, -0.35),
    ];
    LJS.drawPoly(points, colors.bucket, 0.04, colors.bucketEdge, this.pos, this.angle);
    LJS.drawRect(this.pos.add(vec2(0, 0.28)), vec2(0.78, 0.12), colors.bucketEdge, this.angle);
    LJS.drawRect(this.pos.add(vec2(0, 0.19)), vec2(0.58, 0.16), colors.orange, this.angle);
    LJS.drawLine(
      this.pos.add(vec2(-0.27, 0.34)),
      this.pos.add(vec2(0.27, 0.34)),
      0.05,
      colors.steelLight,
    );
  }
}

class Player extends LJS.EngineObject {
  constructor(pos) {
    super(pos, vec2(0.68, 1.03));
    this.drawSize = vec2(1.28, 1.35);
    this.renderOrder = 20;
    this.coyoteFrames = 0;
    this.jumpBufferFrames = 0;
    this.invulnerableFrames = 0;
    this.mirror = false;
    this.setCollision(true, false, false);
  }

  respawnAfterFall() {
    if (gameState.status !== 'playing') {
      return;
    }

    const previousState = gameState;
    gameState = takeFallHit(gameState, this.invulnerableFrames);
    const tookDamage = gameState !== previousState;
    updateHud();

    if (gameState.status === 'lost') {
      announce('No hard hats left.');
      showOverlay('SHIFT OVER', 'Mr. BB missed the deck. Reset the run and try a cleaner route.', 'TRY AGAIN');
      return;
    }

    announce(tookDamage ? 'Watch the edge. One hard hat lost.' : 'Back on the deck.');
    this.pos = PLAYER_START.copy();
    this.velocity = vec2(0, 0.08);
    this.invulnerableFrames = Math.max(this.invulnerableFrames, 90);
  }

  takeMasticHit(bucket) {
    if (this.invulnerableFrames > 0 || gameState.status !== 'playing') {
      return;
    }

    gameState = takeMasticHit(gameState);
    updateHud();
    this.invulnerableFrames = 100;
    const direction = Math.sign(this.pos.x - bucket.pos.x) || 1;
    this.velocity = vec2(direction * 0.22, 0.24);

    if (gameState.status === 'lost') {
      announce('No hard hats left.');
      showOverlay('SHIFT OVER', 'The mastic got Mr. BB. Reset the run and try a cleaner route.', 'TRY AGAIN');
    } else {
      announce(`Mastic hit. ${gameState.lives} hard hats left.`);
    }
  }

  update() {
    if (this.invulnerableFrames > 0) {
      this.invulnerableFrames -= 1;
    }

    if (this.pos.y < -3) {
      this.respawnAfterFall();
    }

    if (gameState.status !== 'playing') {
      this.velocity.x *= 0.82;
      return;
    }

    const direction = inputDirection();
    const grounded = Boolean(this.groundObject);

    this.coyoteFrames = grounded ? 8 : Math.max(0, this.coyoteFrames - 1);
    this.jumpBufferFrames = jumpWasPressed() ? 8 : Math.max(0, this.jumpBufferFrames - 1);

    if (this.jumpBufferFrames > 0 && this.coyoteFrames > 0) {
      this.velocity.y = 0.285;
      this.jumpBufferFrames = 0;
      this.coyoteFrames = 0;
    }

    if (!jumpIsDown() && this.velocity.y > 0.12) {
      this.velocity.y *= 0.72;
    }

    const acceleration = grounded ? 0.027 : 0.013;
    this.velocity.x = LJS.clamp(this.velocity.x + direction * acceleration, -0.19, 0.19);

    if (!direction) {
      this.velocity.x *= grounded ? 0.72 : 0.96;
    }

    if (direction) {
      this.mirror = direction < 0;
    }
  }

  render() {
    const moving = Math.abs(this.velocity.x) > 0.02;
    const bob = this.groundObject && moving ? Math.sin(LJS.time * 15) * 0.045 : 0;
    const tint = this.invulnerableFrames > 0 && Math.floor(this.invulnerableFrames / 6) % 2 ? rgb(1, 1, 1, 0.25) : rgb(1, 1, 1);
    LJS.drawTile(
      this.pos.add(vec2(0, 0.18 + bob)),
      this.drawSize,
      heroTile,
      tint,
      this.angle,
      this.mirror,
    );
  }
}

const platformLayout = [
  [27, 0.5, 54, 1, false],
  [7.0, 3.0, 5.2, 0.55, true],
  [14.2, 4.8, 4.1, 0.55, true],
  [21.0, 3.0, 5.2, 0.55, true],
  [28.7, 4.7, 5.0, 0.55, true],
  [36.8, 3.2, 4.5, 0.55, true],
  [44.3, 4.8, 5.0, 0.55, true],
  [50.3, 2.6, 3.0, 0.55, true],
];

const ductLayout = [
  [4.0, 1.75],
  [6.1, 4.0],
  [8.1, 4.0],
  [14.2, 5.8],
  [20.0, 4.0],
  [22.1, 4.0],
  [28.7, 5.7],
  [36.8, 4.2],
  [44.3, 5.8],
  [50.3, 3.6],
];

const bucketLayout = [
  [10.6, 10.3],
  [18.0, 9.7],
  [25.0, 10.5],
  [33.0, 9.8],
  [41.0, 10.4],
  [48.2, 9.9],
];

function setupWorld(status = 'intro') {
  LJS.engineObjectsDestroy();
  gameState = createGameState(TOTAL_DUCTS, status);

  for (const [x, y, width, height, raised] of platformLayout) {
    new Platform(vec2(x, y), vec2(width, height), raised);
  }

  for (const [x, y] of ductLayout) {
    new DuctSection(vec2(x, y));
  }

  for (const [x, y] of bucketLayout) {
    new MasticBucket(vec2(x, y));
  }

  player = new Player(PLAYER_START.copy());
  LJS.setCameraPos(vec2(8, 6));
  clearPointerControls();
  updateHud();
}

function beginRun() {
  if (!engineReady) {
    return;
  }

  if (gameState.status === 'won' || gameState.status === 'lost') {
    setupWorld('playing');
  } else {
    gameState = startRun(gameState);
    updateHud();
  }

  hideOverlay();
  gameStage.focus({ preventScroll: true });
}

function restartRun() {
  if (!engineReady) {
    return;
  }
  setupWorld('playing');
  hideOverlay();
  gameStage.focus({ preventScroll: true });
  announce('Run restarted.');
}

function renderBackground() {
  const camera = LJS.cameraPos;
  const viewSize = LJS.getCameraSize();
  LJS.drawRectGradient(camera, viewSize, colors.wallTop, colors.wallBottom);

  const left = camera.x - viewSize.x / 2 - 2;
  const right = camera.x + viewSize.x / 2 + 2;
  const firstBeam = Math.floor(left / 4) * 4;

  for (let x = firstBeam; x <= right; x += 4) {
    LJS.drawRect(vec2(x, 5.6), vec2(0.18, 11.2), colors.beam);
    LJS.drawRect(vec2(x + 0.08, 5.6), vec2(0.04, 11.2), colors.beamEdge);
  }

  for (const y of [2.2, 5.4, 8.6]) {
    LJS.drawRect(vec2(camera.x, y), vec2(viewSize.x + 4, 0.13), colors.beam);
  }

  const ductY = 8.9;
  LJS.drawRect(vec2(camera.x, ductY), vec2(viewSize.x + 5, 0.62), colors.steelDark);
  LJS.drawRect(vec2(camera.x, ductY + 0.11), vec2(viewSize.x + 5, 0.28), colors.steel);
  for (let x = firstBeam - 2; x <= right; x += 2) {
    LJS.drawRect(vec2(x, ductY), vec2(0.09, 0.72), colors.steelLight);
  }

  for (let x = firstBeam; x <= right; x += 8) {
    LJS.drawLine(vec2(x - 1.8, 10.8), vec2(x - 1.8, 9.25), 0.04, colors.steelLight);
    LJS.drawLine(vec2(x + 1.8, 10.8), vec2(x + 1.8, 9.25), 0.04, colors.steelLight);
  }

  LJS.drawRect(vec2(camera.x, -0.4), vec2(viewSize.x + 4, 1.1), colors.deep);
}

function gameInit() {
  LJS.setGravity(vec2(0, -0.012));
  LJS.setObjectDefaultDamping(0.99);
  LJS.setObjectDefaultAngleDamping(0.94);
  LJS.setCameraScale(60);
  heroTile = LJS.tile(vec2(0), vec2(488, 512), 0, 0, 0);
  setupWorld('intro');

  engineReady = true;
  overlayAction.disabled = false;
  overlayAction.textContent = 'START RUN';
  if (orientationGate.hidden) {
    overlayAction.focus({ preventScroll: true });
  }
}

function gameUpdate() {
  if (LJS.keyWasPressed('KeyR')) {
    restartRun();
  }
}

function gameUpdatePost() {
  if (!player) {
    return;
  }

  const targetX = LJS.clamp(player.pos.x, 8, LEVEL_WIDTH - 8);
  const target = vec2(targetX, 6);
  LJS.setCameraPos(LJS.cameraPos.lerp(target, 0.07));
}

function gameRender() {
  renderBackground();
}

function gameRenderPost() {}

document.querySelectorAll('[data-control]').forEach((button) => {
  const control = button.dataset.control;

  const press = (token) => {
    pointerControls[control].add(token);
    button.classList.add('is-pressed');
    if (control === 'jump') {
      pointerControls.jumpQueued = true;
    }
  };

  const release = (event) => {
    pointerControls[control].delete(event.pointerId);
    if (pointerControls[control].size === 0) {
      button.classList.remove('is-pressed');
    }
  };

  button.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    press(event.pointerId);
  });
  button.addEventListener('pointerup', release);
  button.addEventListener('pointercancel', release);
  button.addEventListener('lostpointercapture', release);
  button.addEventListener('click', (event) => {
    if (event.detail !== 0) {
      return;
    }

    const token = `activation:${control}`;
    press(token);
    window.setTimeout(() => {
      pointerControls[control].delete(token);
      if (pointerControls[control].size === 0) {
        button.classList.remove('is-pressed');
      }
    }, control === 'jump' ? 60 : 180);
  });
});

overlayAction.addEventListener('click', beginRun);
restartButtons.forEach((button) => button.addEventListener('click', restartRun));
portraitContinue.addEventListener('click', () => {
  portraitOverride = true;
  syncViewportLayout();
});
window.addEventListener('blur', clearPointerControls);
window.addEventListener('resize', scheduleViewportSync);
window.addEventListener('orientationchange', scheduleViewportSync);
window.visualViewport?.addEventListener('resize', scheduleViewportSync);
screen.orientation?.addEventListener('change', scheduleViewportSync);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearPointerControls();
  }
  syncViewportLayout();
});
document.addEventListener('keydown', (event) => {
  if (
    gameState.status === 'playing' &&
    document.activeElement === gameStage &&
    GAMEPLAY_SCROLL_KEYS.has(event.code)
  ) {
    event.preventDefault();
  }
});

LJS.setGLEnable(false);
LJS.setShowSplashScreen(false);
LJS.setCanvasPixelated(false);
LJS.setInputPreventDefault(false);
LJS.setTouchInputEnable(false);
LJS.setTouchGamepadEnable(false);
syncViewportLayout();
LJS.engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [HERO_SOURCE], gameStage);
