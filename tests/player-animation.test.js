import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MAX_TRACKED_STEP_DISTANCE,
  RUN_DISTANCE_PER_FRAME,
  RUN_FRAME_COUNT,
  createPlayerAnimationState,
  getPlayerTextureIndex,
  resetPlayerAnimation,
  updatePlayerAnimation,
} from '../src/player-animation.js';

const runningInput = (positionX, horizontalSpeed = 0.19) => ({
  positionX,
  horizontalSpeed,
  grounded: true,
  crouching: false,
  playing: true,
});

function advance(state, input) {
  return updatePlayerAnimation(state, input);
}

test('selects the idle texture until grounded movement starts', () => {
  const idle = createPlayerAnimationState(2);
  const running = advance(idle, runningInput(2));

  assert.equal(getPlayerTextureIndex(idle), 0);
  assert.equal(running.mode, 'run');
  assert.equal(running.frameIndex, 0);
  assert.equal(getPlayerTextureIndex(running), 1);
});

test('advances and wraps all four run frames by traveled distance', () => {
  assert.equal(RUN_FRAME_COUNT, 4);

  let state = createPlayerAnimationState(0);
  let positionX = 0;
  const stepsPerFrame = 4;
  const stepDistance = RUN_DISTANCE_PER_FRAME / stepsPerFrame;

  for (let frame = 0; frame < RUN_FRAME_COUNT; frame += 1) {
    for (let step = 0; step < stepsPerFrame; step += 1) {
      positionX += stepDistance;
      state = advance(state, runningInput(positionX));
    }
    assert.equal(state.frameIndex, (frame + 1) % RUN_FRAME_COUNT);
  }

  assert.equal(state.phase, 0);
  assert.equal(getPlayerTextureIndex(state), 1);
});

test('faster travel advances the cycle farther without a sprint-specific clock', () => {
  const initial = createPlayerAnimationState(0);
  const run = advance(initial, runningInput(0.19, 0.19));
  const sprint = advance(initial, runningInput(0.29, 0.29));

  assert.ok(sprint.phase > run.phase);
});

test('forward and reverse travel use the same cadence', () => {
  const forward = advance(createPlayerAnimationState(0), runningInput(0.31, 0.19));
  const reverse = advance(createPlayerAnimationState(0), runningInput(-0.31, -0.19));

  assert.equal(reverse.phase, forward.phase);
  assert.equal(reverse.frameIndex, forward.frameIndex);
});

test('reported speed without actual travel does not cycle the feet', () => {
  const running = advance(createPlayerAnimationState(4), runningInput(4, 0.19));
  const blocked = advance(running, runningInput(4, 0.19));

  assert.equal(blocked.mode, 'run');
  assert.equal(blocked.phase, 0);
  assert.equal(blocked.frameIndex, 0);
});

test('idle, crouch, air, and non-playing states reset the run cycle', () => {
  const moving = advance(createPlayerAnimationState(0), runningInput(0.31));
  const inactiveInputs = [
    { ...runningInput(0.31), horizontalSpeed: 0 },
    { ...runningInput(0.31), crouching: true },
    { ...runningInput(0.31), grounded: false },
    { ...runningInput(0.31), playing: false },
  ];

  for (const input of inactiveInputs) {
    const reset = advance(moving, input);
    assert.deepEqual(reset, createPlayerAnimationState(0.31));
    assert.equal(getPlayerTextureIndex(reset), 0);
  }
});

test('reset anchors a respawn without carrying the previous stride phase', () => {
  const moving = advance(createPlayerAnimationState(12), runningInput(12.31));
  const respawned = resetPlayerAnimation(2.2);

  assert.notEqual(moving.phase, 0);
  assert.deepEqual(respawned, createPlayerAnimationState(2.2));
});

test('a teleport-sized discontinuity is ignored and re-anchors the next step', () => {
  const moving = advance(createPlayerAnimationState(0), runningInput(0.31));
  const teleported = advance(
    moving,
    runningInput(0.31 + MAX_TRACKED_STEP_DISTANCE + 0.01),
  );
  const resumed = advance(
    teleported,
    runningInput(0.31 + MAX_TRACKED_STEP_DISTANCE + 0.2),
  );

  assert.equal(teleported.phase, moving.phase);
  assert.equal(teleported.frameIndex, moving.frameIndex);
  assert.ok(
    Math.abs(resumed.phase - (moving.phase + 0.19 / RUN_DISTANCE_PER_FRAME)) <
      Number.EPSILON,
  );
});
