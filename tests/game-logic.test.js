import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DUCT_POINTS,
  MASTIC_PENALTY,
  STARTING_LIVES,
  collectDuct,
  createGameState,
  startRun,
  takeFallHit,
  takeMasticHit,
} from '../src/game-logic.js';

test('creates an intro state with three hard hats', () => {
  const state = createGameState(10);

  assert.deepEqual(state, {
    score: 0,
    lives: STARTING_LIVES,
    collectedDucts: 0,
    totalDucts: 10,
    status: 'intro',
  });
});

test('collecting the final duct wins the run', () => {
  let state = startRun(createGameState(2));
  state = collectDuct(state);
  state = collectDuct(state);

  assert.equal(state.score, DUCT_POINTS * 2);
  assert.equal(state.collectedDucts, 2);
  assert.equal(state.status, 'won');
});

test('mastic removes one hard hat and deducts points without going negative', () => {
  let state = startRun(createGameState(3));
  state = collectDuct(state);
  state = takeMasticHit(state);
  state = takeMasticHit(state);

  assert.equal(state.lives, 1);
  assert.equal(state.score, Math.max(0, DUCT_POINTS - MASTIC_PENALTY * 2));
});

test('the third mastic hit ends the run', () => {
  let state = startRun(createGameState(1));
  state = takeMasticHit(state);
  state = takeMasticHit(state);
  state = takeMasticHit(state);

  assert.equal(state.lives, 0);
  assert.equal(state.status, 'lost');
});

test('completed and lost runs ignore further scoring changes', () => {
  let won = startRun(createGameState(1));
  won = collectDuct(won);
  assert.equal(takeMasticHit(won), won);

  let lost = startRun(createGameState(1));
  lost = takeMasticHit(takeMasticHit(takeMasticHit(lost)));
  assert.equal(collectDuct(lost), lost);
});

test('a bucket knockback cannot charge a second fall penalty while protected', () => {
  let state = startRun(createGameState(1));
  state = takeMasticHit(state);

  assert.equal(takeFallHit(state, 99), state);

  const afterUnprotectedFall = takeFallHit(state, 0);
  assert.equal(afterUnprotectedFall.lives, state.lives - 1);
  assert.equal(afterUnprotectedFall.score, Math.max(0, state.score - MASTIC_PENALTY));
});
