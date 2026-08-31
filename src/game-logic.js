export const STARTING_LIVES = 3;
export const DUCT_POINTS = 100;
export const MASTIC_PENALTY = 75;

export function createGameState(totalDucts, status = 'intro') {
  if (!Number.isInteger(totalDucts) || totalDucts < 1) {
    throw new TypeError('totalDucts must be a positive integer');
  }

  return {
    score: 0,
    lives: STARTING_LIVES,
    collectedDucts: 0,
    totalDucts,
    status,
  };
}

export function startRun(state) {
  return { ...state, status: 'playing' };
}

export function collectDuct(state) {
  if (state.status !== 'playing' || state.collectedDucts >= state.totalDucts) {
    return state;
  }

  const collectedDucts = state.collectedDucts + 1;
  return {
    ...state,
    collectedDucts,
    score: state.score + DUCT_POINTS,
    status: collectedDucts === state.totalDucts ? 'won' : state.status,
  };
}

export function takeMasticHit(state) {
  if (state.status !== 'playing') {
    return state;
  }

  const lives = Math.max(0, state.lives - 1);
  return {
    ...state,
    lives,
    score: Math.max(0, state.score - MASTIC_PENALTY),
    status: lives === 0 ? 'lost' : state.status,
  };
}

export function takeFallHit(state, invulnerableFrames = 0) {
  return invulnerableFrames > 0 ? state : takeMasticHit(state);
}
