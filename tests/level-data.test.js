import assert from 'node:assert/strict';
import test from 'node:test';

import {
  HAZARD_DEFINITIONS,
  HAZARD_LAYOUT,
  PART_DEFINITIONS,
  PART_LAYOUT,
} from '../src/level-data.js';

test('level one contains ten varied HVAC parts', () => {
  assert.equal(PART_LAYOUT.length, 10);
  assert.deepEqual(
    new Set(PART_LAYOUT.map(([, , kind]) => kind)),
    new Set(Object.keys(PART_DEFINITIONS)),
  );
});

test('falling hazards include mastic, hammers, and 2x4 lumber', () => {
  assert.equal(HAZARD_LAYOUT.length, 6);
  assert.deepEqual(
    new Set(HAZARD_LAYOUT.map(([, , kind]) => kind)),
    new Set(Object.keys(HAZARD_DEFINITIONS)),
  );
});

test('every level object references a complete definition', () => {
  for (const [, , kind] of PART_LAYOUT) {
    const definition = PART_DEFINITIONS[kind];
    assert.ok(definition);
    assert.ok(definition.label);
    assert.ok(definition.width > 0);
    assert.ok(definition.height > 0);
  }

  for (const [, , kind] of HAZARD_LAYOUT) {
    const definition = HAZARD_DEFINITIONS[kind];
    assert.ok(definition);
    assert.ok(definition.label);
    assert.ok(definition.width > 0);
    assert.ok(definition.height > 0);
    assert.ok(definition.gravityScale > 0);
  }
});
