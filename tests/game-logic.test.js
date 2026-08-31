import assert from 'node:assert/strict';
import test from 'node:test';

import {
  HAZARD_PENALTY,
  PART_POINTS,
  STARTING_LIVES,
  collectPart,
  createGameState,
  startRun,
  takeFallHit,
  takeHazardHit,
} from '../src/game-logic.js';

test('creates an intro state with three hard hats', () => {
  const state = createGameState(10);

  assert.equal(STARTING_LIVES, 3);
  assert.equal(PART_POINTS, 100);
  assert.equal(HAZARD_PENALTY, 75);
  assert.deepEqual(state, {
    score: 0,
    lives: STARTING_LIVES,
    collectedParts: 0,
    totalParts: 10,
    inventory: {
      rectangular: 0,
      round: 0,
      elbow: 0,
      screws: 0,
    },
    status: 'intro',
  });
});

test('requires a positive integer part total', () => {
  for (const invalidTotal of [0, -1, 1.5, Number.NaN, '4']) {
    assert.throws(() => createGameState(invalidTotal), {
      name: 'TypeError',
      message: 'totalParts must be a positive integer',
    });
  }
});

test('collects and counts every supported job-part kind', () => {
  let state = startRun(createGameState(6));

  for (const kind of ['rectangular', 'round', 'elbow', 'screws']) {
    const previous = state;
    state = collectPart(state, kind);

    assert.notEqual(state, previous);
    assert.notEqual(state.inventory, previous.inventory);
    assert.equal(state.inventory[kind], 1);
  }

  state = collectPart(state, 'round');

  assert.equal(state.score, 500);
  assert.equal(state.collectedParts, 5);
  assert.equal(state.inventory.round, 2);
  assert.equal(state.status, 'playing');
});

test('a mixed final collection wins the run', () => {
  let state = startRun(createGameState(4));
  state = collectPart(state, 'rectangular');
  state = collectPart(state, 'round');
  state = collectPart(state, 'screws');
  state = collectPart(state, 'elbow');

  assert.equal(state.score, PART_POINTS * 4);
  assert.equal(state.collectedParts, 4);
  assert.deepEqual(state.inventory, {
    rectangular: 1,
    round: 1,
    elbow: 1,
    screws: 1,
  });
  assert.equal(state.status, 'won');
});

test('an invalid part kind throws before changing state', () => {
  const state = startRun(createGameState(2));
  const snapshot = structuredClone(state);
  const hostileKind = {
    [Symbol.toPrimitive]() {
      state.score = 999;
      throw new RangeError('must not be called');
    },
  };

  for (const kind of ['duct', '', null, '__proto__', hostileKind]) {
    assert.throws(() => collectPart(state, kind), {
      name: 'TypeError',
      message: 'kind must be one of: rectangular, round, elbow, screws',
    });
  }

  assert.deepEqual(state, snapshot);
});

test('hazards remove one hard hat and deduct points without going negative', () => {
  let state = startRun(createGameState(3));
  state = collectPart(state, 'round');
  state = takeHazardHit(state);

  assert.equal(state.score, 25);

  state = takeHazardHit(state);

  assert.equal(state.lives, 1);
  assert.equal(state.score, 0);
});

test('the third hazard hit ends the run', () => {
  let state = startRun(createGameState(1));
  state = takeHazardHit(state);
  state = takeHazardHit(state);
  state = takeHazardHit(state);

  assert.equal(state.lives, 0);
  assert.equal(state.status, 'lost');
});

test('completed and lost runs ignore further game-state changes', () => {
  let won = startRun(createGameState(1));
  won = collectPart(won, 'elbow');
  assert.equal(collectPart(won, 'screws'), won);
  assert.equal(takeHazardHit(won), won);
  assert.equal(takeFallHit(won), won);
  assert.throws(() => collectPart(won, 'duct'), TypeError);

  let lost = startRun(createGameState(1));
  lost = takeHazardHit(takeHazardHit(takeHazardHit(lost)));
  assert.equal(collectPart(lost, 'rectangular'), lost);
  assert.equal(takeHazardHit(lost), lost);
  assert.equal(takeFallHit(lost), lost);
  assert.throws(() => collectPart(lost, 'duct'), TypeError);
});

test('an invulnerable knockback cannot charge a second fall penalty', () => {
  let state = startRun(createGameState(1));
  state = takeHazardHit(state);

  assert.equal(takeFallHit(state, 99), state);

  const afterUnprotectedFall = takeFallHit(state, 0);
  assert.equal(afterUnprotectedFall.lives, state.lives - 1);
  assert.equal(afterUnprotectedFall.score, Math.max(0, state.score - HAZARD_PENALTY));
});

test('an unprotected fall delegates the complete terminal transition to hazard logic', () => {
  let oneLife = startRun(createGameState(3));
  oneLife = collectPart(oneLife, 'screws');
  oneLife = takeHazardHit(takeHazardHit(oneLife));

  const hazardResult = takeHazardHit(oneLife);
  const fallResult = takeFallHit(oneLife);

  assert.deepEqual(fallResult, hazardResult);
  assert.equal(fallResult.status, 'lost');
  assert.equal(fallResult.lives, 0);
  assert.deepEqual(fallResult.inventory, oneLife.inventory);
  assert.equal(fallResult.collectedParts, oneLife.collectedParts);
});
