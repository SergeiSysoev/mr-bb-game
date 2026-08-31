export const SWIPE_COMMIT_DISTANCE = 34;
export const SWIPE_PREVIEW_DISTANCE = 10;
export const DOUBLE_SWIPE_WINDOW_MS = 360;

const DIRECTIONS = new Set(['left', 'right', 'up', 'down']);

export function classifySwipe(
  { startX, startY, endX, endY },
  { minDistance = SWIPE_COMMIT_DISTANCE, axisBias = 1.15 } = {},
) {
  const values = [startX, startY, endX, endY, minDistance, axisBias];
  if (!values.every(Number.isFinite) || minDistance < 0 || axisBias < 1) {
    return null;
  }

  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const distanceX = Math.abs(deltaX);
  const distanceY = Math.abs(deltaY);

  if (Math.max(distanceX, distanceY) < minDistance) {
    return null;
  }

  if (distanceX >= distanceY * axisBias) {
    return deltaX > 0 ? 'right' : 'left';
  }

  if (distanceY >= distanceX * axisBias) {
    return deltaY > 0 ? 'down' : 'up';
  }

  return null;
}

export function getSwipeAction(direction, isDouble = false) {
  if (!DIRECTIONS.has(direction)) {
    return null;
  }

  if (direction === 'right') {
    return isDouble ? 'sprint' : 'run';
  }

  if (direction === 'up') {
    return isDouble ? 'high-jump' : 'jump';
  }

  return direction === 'left' ? 'back' : 'crouch';
}

export function reduceGestureIntent(intent, action) {
  const next = { ...intent };

  if (action === 'run') {
    return { ...next, direction: 1, sprint: false, crouching: false };
  }

  if (action === 'sprint') {
    return { ...next, direction: 1, sprint: true, crouching: false };
  }

  if (action === 'back') {
    return { ...next, direction: -1, sprint: false, crouching: false };
  }

  if (action === 'crouch') {
    return { ...next, direction: 0, sprint: false, crouching: true };
  }

  if (action === 'jump' || action === 'high-jump') {
    return { ...next, crouching: false };
  }

  return next;
}

export function createSwipeSequence(windowMs = DOUBLE_SWIPE_WINDOW_MS) {
  let lastDirection = null;
  let lastTime = Number.NEGATIVE_INFINITY;

  return {
    register(direction, time) {
      if (!DIRECTIONS.has(direction) || !Number.isFinite(time)) {
        return { direction: null, isDouble: false };
      }

      const elapsed = time - lastTime;
      const isDouble =
        direction === lastDirection && elapsed >= 0 && elapsed <= windowMs;

      if (isDouble) {
        lastDirection = null;
        lastTime = Number.NEGATIVE_INFINITY;
      } else {
        lastDirection = direction;
        lastTime = time;
      }

      return { direction, isDouble };
    },

    reset() {
      lastDirection = null;
      lastTime = Number.NEGATIVE_INFINITY;
    },
  };
}
