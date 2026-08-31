import assert from 'node:assert/strict';
import test from 'node:test';

import {
  classifySwipe,
  createSwipeSequence,
  getSwipeAction,
  reduceGestureIntent,
} from '../src/gesture-input.js';

const swipe = (endX, endY) => ({ startX: 100, startY: 100, endX, endY });

test('classifies all four dominant swipe directions', () => {
  assert.equal(classifySwipe(swipe(150, 104)), 'right');
  assert.equal(classifySwipe(swipe(50, 96)), 'left');
  assert.equal(classifySwipe(swipe(104, 50)), 'up');
  assert.equal(classifySwipe(swipe(96, 150)), 'down');
});

test('rejects short, ambiguous, and invalid swipes', () => {
  assert.equal(classifySwipe(swipe(120, 102)), null);
  assert.equal(classifySwipe(swipe(140, 140)), null);
  assert.equal(classifySwipe({ ...swipe(150, 100), endX: Number.NaN }), null);
});

test('the first swipe acts immediately and the matching second swipe upgrades it', () => {
  const sequence = createSwipeSequence(360);

  assert.deepEqual(sequence.register('right', 1000), { direction: 'right', isDouble: false });
  assert.deepEqual(sequence.register('right', 1300), { direction: 'right', isDouble: true });
  assert.deepEqual(sequence.register('right', 1400), { direction: 'right', isDouble: false });
});

test('expired and interrupted swipe pairs remain single actions', () => {
  const sequence = createSwipeSequence(360);

  sequence.register('up', 0);
  assert.equal(sequence.register('up', 361).isDouble, false);

  sequence.reset();
  sequence.register('right', 1000);
  sequence.register('up', 1100);
  assert.equal(sequence.register('right', 1200).isDouble, false);
  assert.equal(sequence.register('right', 1500).isDouble, true);
});

test('double gestures map to high jump and forward sprint only', () => {
  assert.equal(getSwipeAction('right', false), 'run');
  assert.equal(getSwipeAction('right', true), 'sprint');
  assert.equal(getSwipeAction('up', false), 'jump');
  assert.equal(getSwipeAction('up', true), 'high-jump');
  assert.equal(getSwipeAction('left', true), 'back');
  assert.equal(getSwipeAction('down', true), 'crouch');
});

test('jump preserves horizontal intent while back and crouch clear sprint', () => {
  const idle = { direction: 0, sprint: false, crouching: false };
  const running = reduceGestureIntent(idle, 'run');
  const jumping = reduceGestureIntent(running, 'jump');
  const sprinting = reduceGestureIntent(jumping, 'sprint');
  const backingUp = reduceGestureIntent(sprinting, 'back');
  const crouching = reduceGestureIntent(sprinting, 'crouch');

  assert.deepEqual(jumping, { direction: 1, sprint: false, crouching: false });
  assert.deepEqual(sprinting, { direction: 1, sprint: true, crouching: false });
  assert.deepEqual(backingUp, { direction: -1, sprint: false, crouching: false });
  assert.deepEqual(crouching, { direction: 0, sprint: false, crouching: true });
});
