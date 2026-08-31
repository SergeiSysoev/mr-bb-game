export const STARTING_LIVES = 3;
export const PART_POINTS = 100;
export const HAZARD_PENALTY = 75;

const PART_KINDS = new Set(['rectangular', 'round', 'elbow', 'screws']);

export function createGameState(totalParts, status = 'intro') {
  if (!Number.isInteger(totalParts) || totalParts < 1) {
    throw new TypeError('totalParts must be a positive integer');
  }

  return {
    score: 0,
    lives: STARTING_LIVES,
    collectedParts: 0,
    totalParts,
    inventory: {
      rectangular: 0,
      round: 0,
      elbow: 0,
      screws: 0,
    },
    status,
  };
}

export function startRun(state) {
  return { ...state, status: 'playing' };
}

export function collectPart(state, kind) {
  if (!PART_KINDS.has(kind)) {
    throw new TypeError('kind must be one of: rectangular, round, elbow, screws');
  }

  if (state.status !== 'playing' || state.collectedParts >= state.totalParts) {
    return state;
  }

  const collectedParts = state.collectedParts + 1;
  return {
    ...state,
    collectedParts,
    inventory: {
      ...state.inventory,
      [kind]: state.inventory[kind] + 1,
    },
    score: state.score + PART_POINTS,
    status: collectedParts === state.totalParts ? 'won' : state.status,
  };
}

export function takeHazardHit(state) {
  if (state.status !== 'playing') {
    return state;
  }

  const lives = Math.max(0, state.lives - 1);
  return {
    ...state,
    lives,
    score: Math.max(0, state.score - HAZARD_PENALTY),
    status: lives === 0 ? 'lost' : state.status,
  };
}

export function takeFallHit(state, invulnerableFrames = 0) {
  return invulnerableFrames > 0 ? state : takeHazardHit(state);
}
