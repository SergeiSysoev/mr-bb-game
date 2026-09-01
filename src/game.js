import * as LJS from '../vendor/littlejs.esm.min.js';
import {
  collectPart,
  createGameState,
  startRun,
  takeFallHit,
  takeHazardHit as applyHazardHit,
} from './game-logic.js';
import {
  HAZARD_DEFINITIONS,
  HAZARD_LAYOUT,
  PART_DEFINITIONS,
  PART_LAYOUT,
} from './level-data.js';
import {
  getGameCanvasSize,
  isPhoneLandscapeViewport,
  isLandscapeViewport,
} from './viewport.js';
import {
  SWIPE_PREVIEW_DISTANCE,
  classifySwipe,
  createSwipeSequence,
  getSwipeAction,
  reduceGestureIntent,
} from './gesture-input.js';
import {
  createPlayerAnimationState,
  getPlayerTextureIndex,
  resetPlayerAnimation,
  updatePlayerAnimation,
} from './player-animation.js';

const { vec2, rgb } = LJS;
const documentRoot = document.documentElement;
const isEmbedded = new URLSearchParams(window.location.search).get('embed') === '1';

documentRoot.classList.toggle('is-embedded', isEmbedded);

const TOTAL_PARTS = PART_LAYOUT.length;
const LEVEL_WIDTH = 54;
const PLAYER_START = vec2(2.2, 2.1);
const HERO_SOURCE = new URL('../assets/mr-bb-v2.png', import.meta.url).href;
const HERO_SOURCES = [
  HERO_SOURCE,
  new URL('../assets/mr-bb-run-contact-a.png', import.meta.url).href,
  new URL('../assets/mr-bb-run-passing-a.png', import.meta.url).href,
  new URL('../assets/mr-bb-run-contact-b.png', import.meta.url).href,
  new URL('../assets/mr-bb-run-passing-b.png', import.meta.url).href,
];
const GAMEPLAY_SCROLL_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space']);
const MANUAL_MOVEMENT_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowDown', 'KeyA', 'KeyD', 'KeyS']);
const RUN_SPEED = 0.19;
const SPRINT_SPEED = 0.29;
const JUMP_SPEED = 0.285;
const HIGH_JUMP_SPEED = 0.39;
const GESTURE_CROUCH_FRAMES = 45;
const GESTURE_EDGE_GUARD = 18;

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
  pickupGlow: rgb(1, 0.66, 0.02, 0.16),
  wood: rgb(0.55, 0.29, 0.10),
  woodLight: rgb(0.82, 0.52, 0.22),
  woodDark: rgb(0.26, 0.13, 0.055),
};

const scoreValue = document.querySelector('#score-value');
const partsValue = document.querySelector('#parts-value');
const livesValue = document.querySelector('#lives-value');
const overlay = document.querySelector('#game-overlay');
const overlayTitle = document.querySelector('#overlay-title');
const overlayCopy = document.querySelector('#overlay-copy');
const overlayAction = document.querySelector('#overlay-action');
const restartButtons = document.querySelectorAll('[data-action="restart"]');
const stageRestartButton = document.querySelector('#stage-restart-button');
const announcement = document.querySelector('#game-announcement');
const gameStage = document.querySelector('#game-stage');
const gameFooter = document.querySelector('.game-footer');
const page = document.querySelector('.page');
const orientationGate = document.querySelector('#orientation-gate');
const orientationTitle = document.querySelector('#orientation-title');
const gestureTracker = document.querySelector('#gesture-tracker');
const gestureTrackerIcon = document.querySelector('#gesture-tracker-icon');
const gestureFeedback = document.querySelector('#gesture-feedback');
const gestureFeedbackIcon = document.querySelector('#gesture-feedback-icon');
const gestureFeedbackLabel = document.querySelector('#gesture-feedback-label');

let gameState = createGameState(TOTAL_PARTS);
let player;
let heroTile;
let heroTiles = [];
let engineReady = false;
let engineStartPromise;
let engineStartSignal;
let announcementTimer;
let viewportSyncFrame = 0;
let lastCanvasSize = '';
let activeGesture = null;
let gestureFeedbackTimer;
let gestureCrouchFrames = 0;
let gestureIntent = { direction: 0, sprint: false, crouching: false };
let initialRunStarted = false;

const gestureJump = {
  normalQueued: false,
  highQueued: false,
  holdFrames: 0,
};

const swipeSequence = createSwipeSequence();

const gestureFeedbackContent = {
  run: { icon: '→', label: 'AUTO RUN', power: false, persistent: true },
  sprint: { icon: '»', label: 'SPRINT', power: true, persistent: true },
  back: { icon: '←', label: 'BACK', power: false, persistent: true },
  jump: { icon: '↑', label: 'JUMP', power: false, persistent: false },
  'high-jump': { icon: '⇈', label: 'HIGH JUMP', power: true, persistent: false },
  crouch: { icon: '↓', label: 'CROUCH', power: false, persistent: false },
};

function formatScore(score) {
  return String(score).padStart(4, '0');
}

function updateHud() {
  scoreValue.textContent = formatScore(gameState.score);
  partsValue.textContent = `${gameState.collectedParts} / ${gameState.totalParts}`;
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

function hideGestureFeedback() {
  window.clearTimeout(gestureFeedbackTimer);
  gestureFeedback.classList.remove('is-visible', 'is-power');
}

function showGestureFeedback(action) {
  const content = gestureFeedbackContent[action];
  if (!content) {
    return;
  }

  window.clearTimeout(gestureFeedbackTimer);
  gestureFeedbackIcon.textContent = content.icon;
  gestureFeedbackLabel.textContent = content.label;
  gestureFeedback.classList.toggle('is-power', content.power);
  gestureFeedback.classList.add('is-visible');

  if (!content.persistent) {
    gestureFeedbackTimer = window.setTimeout(() => {
      if (gestureIntent.sprint) {
        showGestureFeedback('sprint');
      } else if (gestureIntent.direction > 0) {
        showGestureFeedback('run');
      } else if (gestureIntent.direction < 0) {
        showGestureFeedback('back');
      } else {
        hideGestureFeedback();
      }
    }, 720);
  }
}

function hideGestureTracker() {
  gestureTracker.classList.remove('is-visible');
  gestureTrackerIcon.textContent = '•';
}

function clearActiveGesture() {
  const pointerId = activeGesture?.pointerId;
  activeGesture = null;
  hideGestureTracker();

  if (pointerId !== undefined && gameStage.hasPointerCapture(pointerId)) {
    gameStage.releasePointerCapture(pointerId);
  }
}

function clearGestureMotion() {
  gestureIntent = { direction: 0, sprint: false, crouching: false };
  gestureCrouchFrames = 0;
  hideGestureFeedback();
}

function clearGestureControls() {
  clearGestureMotion();
  gestureJump.normalQueued = false;
  gestureJump.highQueued = false;
  gestureJump.holdFrames = 0;
  swipeSequence.reset();
  clearActiveGesture();
}

function showOverlay(title, copy, actionLabel) {
  clearAllControls();
  overlayTitle.textContent = title;
  overlayCopy.textContent = copy;
  overlayAction.textContent = actionLabel;
  overlay.removeAttribute('aria-hidden');
  overlay.inert = false;
  gameFooter.inert = true;
  stageRestartButton.inert = true;
  overlay.classList.remove('is-hidden');
  overlayAction.focus({ preventScroll: true });
}

function hideOverlay() {
  overlay.classList.add('is-hidden');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.inert = true;
  gameFooter.inert = false;
  stageRestartButton.inert = false;
}

function clearAllControls() {
  clearGestureControls();
  player?.setCrouching(false);
}

function syncPageInteractivity(orientationBlocked) {
  const pageBlocked = orientationBlocked || !initialRunStarted;
  page.inert = pageBlocked;
  if (pageBlocked) {
    page.setAttribute('aria-hidden', 'true');
  } else {
    page.removeAttribute('aria-hidden');
  }
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

function getScreenMinorAxis() {
  const { width, height } = window.screen;
  return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0
    ? Math.min(width, height)
    : undefined;
}

function syncOrientationGate(width, height, coarsePointer, screenMinorAxis) {
  const isPhoneLandscape = isPhoneLandscapeViewport(
    width,
    height,
    coarsePointer,
    screenMinorAxis,
    isEmbedded,
  );
  documentRoot.classList.toggle('is-phone-landscape', isPhoneLandscape);
  const orientationBlocked = !isLandscapeViewport(width, height);
  const shouldShowGate = initialRunStarted && orientationBlocked;
  const gamePaused = document.hidden || shouldShowGate || !initialRunStarted;
  const gateWasVisible = !orientationGate.hidden;

  documentRoot.dataset.mrBbGamePaused = String(gamePaused);
  orientationGate.hidden = !shouldShowGate;
  orientationGate.setAttribute('aria-hidden', String(!shouldShowGate));
  syncPageInteractivity(shouldShowGate);

  if (shouldShowGate) {
    clearAllControls();
    if (!gateWasVisible) {
      requestAnimationFrame(() => orientationTitle.focus({ preventScroll: true }));
    }
  } else {
    if (gateWasVisible && orientationGate.contains(document.activeElement)) {
      document.activeElement.blur();
    }
    if (gateWasVisible && engineReady && initialRunStarted) {
      requestAnimationFrame(() => {
        const focusTarget = overlay.classList.contains('is-hidden') ? gameStage : overlayAction;
        focusTarget.focus({ preventScroll: true });
      });
    }
  }

  if (engineReady) {
    LJS.setPaused(gamePaused);
  }
}

function syncViewportLayout() {
  const { width, height } = getViewportDimensions();
  const coarsePointer = hasCoarsePointer();
  const screenMinorAxis = getScreenMinorAxis();
  const canvasSize = getGameCanvasSize(
    width,
    height,
    coarsePointer,
    screenMinorAxis,
    isEmbedded,
  );
  const nextCanvasSize = `${canvasSize.width}x${canvasSize.height}`;

  if (nextCanvasSize !== lastCanvasSize) {
    lastCanvasSize = nextCanvasSize;
    LJS.setCanvasFixedSize(vec2(canvasSize.width, canvasSize.height));
  }

  syncOrientationGate(width, height, coarsePointer, screenMinorAxis);
}

function scheduleViewportSync() {
  cancelAnimationFrame(viewportSyncFrame);
  viewportSyncFrame = requestAnimationFrame(syncViewportLayout);
}

function inputMovement() {
  const left = LJS.keyIsDown('ArrowLeft') || LJS.keyIsDown('KeyA');
  const right = LJS.keyIsDown('ArrowRight') || LJS.keyIsDown('KeyD');
  if (left || right) {
    return { direction: Number(right) - Number(left), sprint: false };
  }

  return { direction: gestureIntent.direction, sprint: gestureIntent.sprint };
}

function consumeJumpRequest() {
  const normalQueued =
    LJS.keyWasPressed('ArrowUp') ||
    LJS.keyWasPressed('KeyW') ||
    LJS.keyWasPressed('Space') ||
    gestureJump.normalQueued;
  const highQueued = gestureJump.highQueued;

  gestureJump.normalQueued = false;
  gestureJump.highQueued = false;

  if (highQueued) {
    return HIGH_JUMP_SPEED;
  }

  return normalQueued ? JUMP_SPEED : 0;
}

function crouchIsDown() {
  return (
    LJS.keyIsDown('ArrowDown') ||
    LJS.keyIsDown('KeyS') ||
    gestureCrouchFrames > 0
  );
}

function jumpIsDown() {
  return (
    LJS.keyIsDown('ArrowUp') ||
    LJS.keyIsDown('KeyW') ||
    LJS.keyIsDown('Space') ||
    gestureJump.holdFrames > 0
  );
}

function cancelGestureMotionForManualInput() {
  clearGestureMotion();
  swipeSequence.reset();
  clearActiveGesture();
}

function applySwipeAction(action) {
  gestureIntent = reduceGestureIntent(gestureIntent, action);

  if (action === 'crouch') {
    gestureCrouchFrames = GESTURE_CROUCH_FRAMES;
  } else {
    gestureCrouchFrames = 0;
  }

  if (action === 'jump') {
    gestureJump.normalQueued = true;
    gestureJump.holdFrames = Math.max(gestureJump.holdFrames, 12);
  } else if (action === 'high-jump') {
    gestureJump.normalQueued = false;
    gestureJump.highQueued = true;
    gestureJump.holdFrames = Math.max(gestureJump.holdFrames, 18);
  }

  showGestureFeedback(action);
}

function commitSwipe(direction, time) {
  const sequence = swipeSequence.register(direction, time);
  const action = getSwipeAction(sequence.direction, sequence.isDouble);
  if (action) {
    applySwipeAction(action);
  }
}

function getGesturePoint(event) {
  const rect = gameStage.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    width: rect.width,
    height: rect.height,
  };
}

function updateGestureTracker(point, direction = null) {
  const icons = { left: '←', right: '→', up: '↑', down: '↓' };
  gestureTracker.style.setProperty('--gesture-x', `${point.x}px`);
  gestureTracker.style.setProperty('--gesture-y', `${point.y}px`);
  gestureTrackerIcon.textContent = icons[direction] || '•';
  gestureTracker.classList.add('is-visible');
}

function gestureCanStart(event, point) {
  const target = event.target;
  const isInteractive =
    target instanceof Element && Boolean(target.closest('button, a, input'));
  const isGesturePointer =
    event.pointerType === 'touch' ||
    event.pointerType === 'pen' ||
    (event.pointerType === 'mouse' && event.button === 0);
  const nearSystemEdge =
    point.x < GESTURE_EDGE_GUARD ||
    point.x > point.width - GESTURE_EDGE_GUARD ||
    point.y < GESTURE_EDGE_GUARD ||
    point.y > point.height - GESTURE_EDGE_GUARD;

  return (
    isGesturePointer &&
    !isInteractive &&
    !nearSystemEdge &&
    gameState.status === 'playing' &&
    overlay.classList.contains('is-hidden') &&
    orientationGate.hidden
  );
}

function handleGestureStart(event) {
  if (activeGesture) {
    return;
  }

  const point = getGesturePoint(event);
  if (!gestureCanStart(event, point)) {
    return;
  }

  event.preventDefault();
  activeGesture = {
    pointerId: event.pointerId,
    startX: point.x,
    startY: point.y,
    committed: false,
  };
  gameStage.setPointerCapture(event.pointerId);
  updateGestureTracker(point);
}

function handleGestureMove(event) {
  if (!activeGesture || event.pointerId !== activeGesture.pointerId) {
    return;
  }

  event.preventDefault();
  const point = getGesturePoint(event);
  const swipe = {
    startX: activeGesture.startX,
    startY: activeGesture.startY,
    endX: point.x,
    endY: point.y,
  };
  const previewDirection = classifySwipe(swipe, {
    minDistance: SWIPE_PREVIEW_DISTANCE,
    axisBias: 1.05,
  });
  updateGestureTracker(point, previewDirection);

  if (activeGesture.committed) {
    return;
  }

  const direction = classifySwipe(swipe);
  if (direction) {
    activeGesture.committed = true;
    commitSwipe(direction, event.timeStamp);
  }
}

function finishGesture(event, commitOnRelease) {
  if (!activeGesture || event.pointerId !== activeGesture.pointerId) {
    return;
  }

  if (commitOnRelease && !activeGesture.committed) {
    const point = getGesturePoint(event);
    const direction = classifySwipe({
      startX: activeGesture.startX,
      startY: activeGesture.startY,
      endX: point.x,
      endY: point.y,
    });
    if (direction) {
      commitSwipe(direction, event.timeStamp);
    }
  }

  clearActiveGesture();
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

function inventorySummary(inventory) {
  return `${inventory.rectangular} rectangular, ${inventory.round} round, ${inventory.elbow} elbows, and ${inventory.screws} screw packs`;
}

class JobPart extends LJS.EngineObject {
  constructor(pos, kind) {
    const definition = PART_DEFINITIONS[kind];
    if (!definition) {
      throw new TypeError(`Unsupported job part: ${kind}`);
    }

    super(pos, vec2(definition.width, definition.height));
    this.kind = kind;
    this.definition = definition;
    this.mass = 0;
    this.renderOrder = 12;
  }

  update() {
    if (gameState.status !== 'playing' || !player || !this.isOverlappingObject(player)) {
      return;
    }

    gameState = collectPart(gameState, this.kind);
    this.destroy();
    updateHud();

    if (gameState.status === 'won') {
      announce('All HVAC parts collected. Loadout complete.');
      showOverlay(
        'LOADOUT COMPLETE!',
        `Mr. BB collected ${inventorySummary(gameState.inventory)} for ${gameState.score} points.`,
        'RUN IT AGAIN',
      );
    } else {
      announce(`${this.definition.label} secured. ${gameState.collectedParts} of ${gameState.totalParts}.`);
    }
  }

  render() {
    const pulse = 1 + Math.sin(LJS.time * 5 + this.pos.x) * 0.06;
    LJS.drawCircle(this.pos, Math.max(this.size.x, this.size.y) * 0.72 * pulse, colors.pickupGlow);

    if (this.kind === 'round') {
      this.renderRound(pulse);
    } else if (this.kind === 'elbow') {
      this.renderElbow(pulse);
    } else if (this.kind === 'screws') {
      this.renderScrews(pulse);
    } else {
      this.renderRectangular(pulse);
    }
  }

  renderRectangular(pulse) {
    const size = vec2(this.size.x * pulse, this.size.y);
    LJS.drawRect(this.pos, size, colors.steel, 0.08);
    LJS.drawRect(this.pos.add(vec2(0, 0.15)), vec2(size.x * 0.9, 0.16), colors.steelLight, 0.08);
    LJS.drawRect(this.pos.add(vec2(-size.x * 0.42, 0)), vec2(0.12, size.y * 1.08), colors.steelDark, 0.08);
    LJS.drawRect(this.pos.add(vec2(size.x * 0.42, 0)), vec2(0.12, size.y * 1.08), colors.steelDark, 0.08);
    LJS.drawCircle(this.pos.add(vec2(0.23, -0.12)), 0.06, colors.steelDark);
    LJS.drawCircle(this.pos.add(vec2(-0.23, -0.12)), 0.06, colors.steelDark);
  }

  renderRound(pulse) {
    LJS.drawCircle(this.pos, 0.41 * pulse, colors.steelDark);
    LJS.drawCircle(this.pos, 0.34 * pulse, colors.steel);
    LJS.drawCircle(this.pos.add(vec2(0.035, -0.01)), 0.235 * pulse, colors.deep);
    LJS.drawCircle(this.pos.add(vec2(-0.13, 0.15)), 0.055, colors.steelLight);
    for (const x of [-0.29, 0.29]) {
      LJS.drawRect(this.pos.add(vec2(x * pulse, 0)), vec2(0.07, 0.58), colors.steelLight, 0.02);
    }
  }

  renderElbow(pulse) {
    const horizontal = this.pos.add(vec2(-0.12, 0.15));
    const vertical = this.pos.add(vec2(0.15, -0.12));
    LJS.drawRect(horizontal, vec2(0.66 * pulse, 0.34), colors.steelDark, 0.02);
    LJS.drawRect(vertical, vec2(0.34, 0.66 * pulse), colors.steelDark, 0.02);
    LJS.drawCircle(this.pos.add(vec2(0.14, 0.14)), 0.3 * pulse, colors.steelDark);
    LJS.drawRect(horizontal, vec2(0.58 * pulse, 0.24), colors.steel, 0.02);
    LJS.drawRect(vertical, vec2(0.24, 0.58 * pulse), colors.steel, 0.02);
    LJS.drawCircle(this.pos.add(vec2(0.14, 0.14)), 0.22 * pulse, colors.steel);
    LJS.drawCircle(this.pos.add(vec2(0.22, 0.22)), 0.08, colors.deep);
  }

  renderScrews(pulse) {
    const screws = [
      [-0.26, 0.16, 0.36, -0.27],
      [-0.18, -0.16, 0.43, 0.18],
      [0.04, 0.25, 0.28, -0.36],
    ];

    for (const [x, y, deltaX, deltaY] of screws) {
      const head = this.pos.add(vec2(x * pulse, y));
      const tip = head.add(vec2(deltaX * pulse, deltaY));
      LJS.drawLine(head, tip, 0.09, colors.steelDark);
      LJS.drawLine(head, tip, 0.045, colors.steelLight);
      LJS.drawCircle(head, 0.105, colors.steel);
      LJS.drawLine(head.add(vec2(-0.055, 0)), head.add(vec2(0.055, 0)), 0.025, colors.steelDark);
    }
  }
}

class FallingHazard extends LJS.EngineObject {
  constructor(pos, kind) {
    const definition = HAZARD_DEFINITIONS[kind];
    if (!definition) {
      throw new TypeError(`Unsupported falling hazard: ${kind}`);
    }

    super(pos, vec2(definition.width, definition.height));
    this.kind = kind;
    this.definition = definition;
    this.startPos = pos.copy();
    this.spinDirection = Math.floor(pos.x * 10) % 2 ? -1 : 1;
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
    this.angle = this.kind === 'lumber' ? 0.08 * this.spinDirection : 0;
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
      this.gravityScale = this.definition.gravityScale;
      this.angleVelocity = this.definition.spin * this.spinDirection;
    }

    if (!this.active) {
      return;
    }

    if (this.isOverlappingObject(player)) {
      player.takeHazardHit(this);
      this.reset();
      return;
    }

    if (this.groundObject || this.pos.y < -2) {
      this.reset();
    }
  }

  localPoint(x, y) {
    const cosine = Math.cos(this.angle);
    const sine = Math.sin(this.angle);
    return this.pos.add(vec2(x * cosine - y * sine, x * sine + y * cosine));
  }

  render() {
    if (this.kind === 'hammer') {
      this.renderHammer();
    } else if (this.kind === 'lumber') {
      this.renderLumber();
    } else {
      this.renderMastic();
    }
  }

  renderMastic() {
    const points = [
      vec2(-0.36, 0.3),
      vec2(0.36, 0.3),
      vec2(0.28, -0.35),
      vec2(-0.28, -0.35),
    ];
    LJS.drawPoly(points, colors.bucket, 0.04, colors.bucketEdge, this.pos, this.angle);
    LJS.drawRect(this.localPoint(0, 0.28), vec2(0.78, 0.12), colors.bucketEdge, this.angle);
    LJS.drawRect(this.localPoint(0, 0.19), vec2(0.58, 0.16), colors.orange, this.angle);
    LJS.drawLine(this.localPoint(-0.27, 0.34), this.localPoint(0.27, 0.34), 0.05, colors.steelLight);
  }

  renderHammer() {
    LJS.drawRect(this.localPoint(0, -0.14), vec2(0.17, 0.72), colors.woodDark, this.angle);
    LJS.drawRect(this.localPoint(0, -0.13), vec2(0.1, 0.66), colors.woodLight, this.angle);
    LJS.drawRect(this.localPoint(0, 0.27), vec2(0.72, 0.28), colors.steelDark, this.angle);
    LJS.drawRect(this.localPoint(-0.05, 0.3), vec2(0.58, 0.13), colors.steel, this.angle);
    LJS.drawRect(this.localPoint(0.34, 0.27), vec2(0.08, 0.32), colors.bucketEdge, this.angle);
  }

  renderLumber() {
    LJS.drawRect(this.pos, vec2(1.16, 0.34), colors.woodDark, this.angle);
    LJS.drawRect(this.pos, vec2(1.08, 0.25), colors.woodLight, this.angle);
    LJS.drawRect(this.localPoint(0, 0.06), vec2(1.02, 0.055), colors.wood, this.angle);
    LJS.drawCircle(this.localPoint(-0.28, -0.02), 0.045, colors.woodDark);
    LJS.drawCircle(this.localPoint(0.31, 0.035), 0.035, colors.woodDark);
  }
}

class Player extends LJS.EngineObject {
  constructor(pos) {
    super(pos, vec2(0.68, 1.03));
    this.standingSize = vec2(0.68, 1.03);
    this.crouchingSize = vec2(0.68, 0.66);
    this.standingDrawSize = vec2(1.92, 1.75);
    this.crouchingDrawSize = vec2(1.98, 1.15);
    this.drawSize = this.standingDrawSize.copy();
    this.renderOrder = 20;
    this.coyoteFrames = 0;
    this.jumpBufferFrames = 0;
    this.jumpBufferSpeed = JUMP_SPEED;
    this.jumpUpgradeFrames = 0;
    this.invulnerableFrames = 0;
    this.mirror = false;
    this.crouching = false;
    this.animationState = createPlayerAnimationState(pos.x);
    this.setCollision(true, false, false);
  }

  setCrouching(nextCrouching) {
    if (this.crouching === nextCrouching) {
      return;
    }

    const nextSize = nextCrouching ? this.crouchingSize : this.standingSize;
    const nextDrawSize = nextCrouching ? this.crouchingDrawSize : this.standingDrawSize;
    this.pos.y += (nextSize.y - this.size.y) / 2;
    this.size = nextSize.copy();
    this.drawSize = nextDrawSize.copy();
    this.crouching = nextCrouching;
  }

  respawnAfterFall() {
    if (gameState.status !== 'playing') {
      return;
    }

    const previousState = gameState;
    gameState = takeFallHit(gameState, this.invulnerableFrames);
    const tookDamage = gameState !== previousState;
    clearAllControls();
    updateHud();

    if (gameState.status === 'lost') {
      this.animationState = resetPlayerAnimation(this.pos.x);
      announce('No hard hats left.');
      showOverlay('SHIFT OVER', 'Mr. BB missed the deck. Reset the run and try a cleaner route.', 'TRY AGAIN');
      return;
    }

    announce(tookDamage ? 'Watch the edge. One hard hat lost.' : 'Back on the deck.');
    this.pos = PLAYER_START.copy();
    this.velocity = vec2(0, 0.08);
    this.animationState = resetPlayerAnimation(this.pos.x);
    this.invulnerableFrames = Math.max(this.invulnerableFrames, 90);
  }

  takeHazardHit(hazard) {
    if (this.invulnerableFrames > 0 || gameState.status !== 'playing') {
      return;
    }

    gameState = applyHazardHit(gameState);
    clearAllControls();
    updateHud();
    this.invulnerableFrames = 100;
    const direction = Math.sign(this.pos.x - hazard.pos.x) || 1;
    this.velocity = vec2(direction * 0.22, 0.24);
    this.animationState = resetPlayerAnimation(this.pos.x);

    if (gameState.status === 'lost') {
      announce('No hard hats left.');
      showOverlay(
        'SHIFT OVER',
        `The ${hazard.definition.label.toLowerCase()} got Mr. BB. Reset the run and try a cleaner route.`,
        'TRY AGAIN',
      );
    } else {
      announce(`${hazard.definition.label} hit. ${gameState.lives} hard hats left.`);
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
      this.animationState = updatePlayerAnimation(this.animationState, {
        positionX: this.pos.x,
        horizontalSpeed: this.velocity.x,
        grounded: Boolean(this.groundObject),
        crouching: this.crouching,
        playing: false,
      });
      return;
    }

    const grounded = Boolean(this.groundObject);
    const requestedJumpSpeed = consumeJumpRequest();
    const shouldCrouch = grounded && crouchIsDown() && !requestedJumpSpeed;
    this.setCrouching(shouldCrouch);

    if (gestureCrouchFrames > 0) {
      gestureCrouchFrames -= 1;
      if (gestureCrouchFrames === 0) {
        gestureIntent = { ...gestureIntent, crouching: false };
      }
    }

    if (gestureJump.holdFrames > 0) {
      gestureJump.holdFrames -= 1;
    }

    const movement = inputMovement();
    const direction = shouldCrouch ? 0 : movement.direction;

    this.coyoteFrames = grounded ? 8 : Math.max(0, this.coyoteFrames - 1);
    this.jumpUpgradeFrames = Math.max(0, this.jumpUpgradeFrames - 1);

    if (requestedJumpSpeed === HIGH_JUMP_SPEED && this.jumpUpgradeFrames > 0 && !grounded) {
      this.velocity.y = Math.max(this.velocity.y, HIGH_JUMP_SPEED);
      this.jumpUpgradeFrames = 0;
      this.jumpBufferFrames = 0;
    } else if (requestedJumpSpeed) {
      this.jumpBufferFrames = 8;
      this.jumpBufferSpeed = requestedJumpSpeed;
    } else {
      this.jumpBufferFrames = Math.max(0, this.jumpBufferFrames - 1);
    }

    if (this.jumpBufferFrames > 0 && this.coyoteFrames > 0) {
      this.setCrouching(false);
      this.velocity.y = this.jumpBufferSpeed;
      this.jumpUpgradeFrames = this.jumpBufferSpeed === JUMP_SPEED ? 26 : 0;
      this.jumpBufferFrames = 0;
      this.coyoteFrames = 0;
    }

    if (!jumpIsDown() && this.velocity.y > 0.12) {
      this.velocity.y *= 0.72;
    }

    const maxSpeed = movement.sprint && direction > 0 ? SPRINT_SPEED : RUN_SPEED;
    const acceleration = grounded
      ? movement.sprint && direction > 0
        ? 0.041
        : 0.027
      : movement.sprint && direction > 0
        ? 0.019
        : 0.013;
    this.velocity.x = LJS.clamp(
      this.velocity.x + direction * acceleration,
      -RUN_SPEED,
      maxSpeed,
    );

    if (!direction) {
      this.velocity.x *= grounded ? (shouldCrouch ? 0.48 : 0.72) : 0.96;
    }

    if (direction) {
      this.mirror = direction < 0;
    }

    this.animationState = updatePlayerAnimation(this.animationState, {
      positionX: this.pos.x,
      horizontalSpeed: this.velocity.x,
      grounded: grounded && this.velocity.y <= 0,
      crouching: this.crouching,
      playing: true,
    });
  }

  render() {
    const tint = this.invulnerableFrames > 0 && Math.floor(this.invulnerableFrames / 6) % 2 ? rgb(1, 1, 1, 0.25) : rgb(1, 1, 1);
    LJS.drawTile(
      this.pos.add(vec2(0, this.crouching ? 0.24 : 0.36)),
      this.drawSize,
      heroTiles[getPlayerTextureIndex(this.animationState)],
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

function setupWorld(status = 'intro') {
  LJS.engineObjectsDestroy();
  gameState = createGameState(TOTAL_PARTS, status);

  for (const [x, y, width, height, raised] of platformLayout) {
    new Platform(vec2(x, y), vec2(width, height), raised);
  }

  for (const [x, y, kind] of PART_LAYOUT) {
    new JobPart(vec2(x, y), kind);
  }

  for (const [x, y, kind] of HAZARD_LAYOUT) {
    new FallingHazard(vec2(x, y), kind);
  }

  player = new Player(PLAYER_START.copy());
  LJS.setCameraPos(vec2(8, 6));
  clearAllControls();
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
  if (engineStartSignal?.aborted) {
    throw new Error('Mr. BB startup was cancelled.');
  }

  LJS.setGravity(vec2(0, -0.012));
  LJS.setObjectDefaultDamping(0.99);
  LJS.setObjectDefaultAngleDamping(0.94);
  LJS.setCameraScale(60);
  heroTile = LJS.tile(vec2(0), vec2(488, 446), 0, 0, 0);
  heroTiles = [
    heroTile,
    ...HERO_SOURCES.slice(1).map((_, sourceIndex) =>
      LJS.tile(vec2(0), vec2(488, 446), sourceIndex + 1, 0, 0),
    ),
  ];
  setupWorld('intro');

  engineReady = true;
  LJS.setPaused(true);
}

function gameUpdate() {
  if (initialRunStarted && LJS.keyWasPressed('KeyR')) {
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

gameStage.addEventListener('pointerdown', handleGestureStart);
gameStage.addEventListener('pointermove', handleGestureMove, { passive: false });
gameStage.addEventListener('pointerup', (event) => finishGesture(event, true));
gameStage.addEventListener('pointercancel', (event) => finishGesture(event, false));
gameStage.addEventListener('lostpointercapture', (event) => finishGesture(event, false));
overlayAction.addEventListener('click', beginRun);
restartButtons.forEach((button) => button.addEventListener('click', restartRun));
window.addEventListener('blur', clearAllControls);
window.addEventListener('resize', scheduleViewportSync);
window.addEventListener('orientationchange', scheduleViewportSync);
window.visualViewport?.addEventListener('resize', scheduleViewportSync);
screen.orientation?.addEventListener('change', scheduleViewportSync);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearAllControls();
  }
  syncViewportLayout();
});
document.addEventListener('keydown', (event) => {
  if (gameState.status === 'playing' && MANUAL_MOVEMENT_KEYS.has(event.code)) {
    cancelGestureMotionForManualInput();
  }

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

export function startGame(signal) {
  if (engineStartPromise) {
    return engineStartPromise;
  }

  if (signal?.aborted) {
    return Promise.reject(new Error('Mr. BB startup was cancelled.'));
  }

  const { width, height } = getViewportDimensions();
  if (!isLandscapeViewport(width, height) || document.hidden) {
    return Promise.reject(new Error('Mr. BB starts only in landscape.'));
  }

  engineStartSignal = signal;
  const pendingStart = (async () => {
    syncViewportLayout();
    await LJS.engineInit(
      gameInit,
      gameUpdate,
      gameUpdatePost,
      gameRender,
      gameRenderPost,
      HERO_SOURCES,
      gameStage,
    );
    if (!engineReady) {
      throw new Error('The Mr. BB engine did not become ready.');
    }
  })();
  engineStartPromise = pendingStart.catch((error) => {
    engineReady = false;
    gameStage.querySelectorAll('canvas').forEach((canvas) => canvas.remove());
    throw error;
  });
  return engineStartPromise;
}

export function activateGame() {
  const { width, height } = getViewportDimensions();
  if (
    !engineReady ||
    initialRunStarted ||
    !isLandscapeViewport(width, height) ||
    document.hidden
  ) {
    return false;
  }

  initialRunStarted = true;
  syncPageInteractivity(false);
  beginRun();
  syncViewportLayout();
  return true;
}
