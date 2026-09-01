export const RUN_FRAME_COUNT = 4;
export const RUN_DISTANCE_PER_FRAME = 1;
export const RUN_MOVEMENT_THRESHOLD = 0.02;
export const MAX_TRACKED_STEP_DISTANCE = 0.5;

export function createPlayerAnimationState(positionX = 0) {
  return {
    mode: 'idle',
    phase: 0,
    frameIndex: 0,
    lastX: positionX,
  };
}

export function resetPlayerAnimation(positionX = 0) {
  return createPlayerAnimationState(positionX);
}

export function updatePlayerAnimation(
  state,
  {
    positionX,
    horizontalSpeed,
    grounded,
    crouching,
    playing,
  },
) {
  const nextX = Number.isFinite(positionX) ? positionX : state.lastX;
  const running =
    playing &&
    grounded &&
    !crouching &&
    Math.abs(horizontalSpeed) > RUN_MOVEMENT_THRESHOLD;

  if (!running) {
    return resetPlayerAnimation(nextX);
  }

  const distance = Math.abs(nextX - state.lastX);
  if (!Number.isFinite(distance) || distance > MAX_TRACKED_STEP_DISTANCE) {
    return { ...state, mode: 'run', lastX: nextX };
  }

  const phase = (state.phase + distance / RUN_DISTANCE_PER_FRAME) % RUN_FRAME_COUNT;
  return {
    mode: 'run',
    phase,
    frameIndex: Math.floor(phase),
    lastX: nextX,
  };
}

export function getPlayerTextureIndex(state) {
  return state.mode === 'run' ? state.frameIndex + 1 : 0;
}
