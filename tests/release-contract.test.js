import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  getGameCanvasSize,
  isPhoneLandscapeViewport,
  isPhonePortraitViewport,
} from '../src/viewport.js';

const projectFile = (path) => new URL(`../${path}`, import.meta.url);
const readProjectFile = (path) => readFile(projectFile(path), 'utf8');

test('LittleJS global input interception stays disabled', async () => {
  const gameSource = await readProjectFile('src/game.js');

  assert.match(gameSource, /LJS\.setInputPreventDefault\(false\)/);
  assert.match(gameSource, /LJS\.setTouchInputEnable\(false\)/);
  assert.match(gameSource, /function restartRun\(\).*gameStage\.focus\(\{ preventScroll: true \}\)/s);
});

test('the published build retains the LittleJS MIT notice', async () => {
  const [vendoredLicense, publicLicense] = await Promise.all([
    readProjectFile('vendor/LITTLEJS-LICENSE.txt'),
    readProjectFile('public/LITTLEJS-LICENSE.txt'),
  ]);

  assert.equal(publicLicense, vendoredLicense);
  assert.match(publicLicense, /Permission is hereby granted/);
});

test('GitHub Pages keeps the repository path prefix', async () => {
  const viteConfig = await readProjectFile('vite.config.js');
  assert.match(viteConfig, /GITHUB_PAGES.*\/mr-bb-game\//s);
});

test('the blocking game overlay exposes dialog semantics', async () => {
  const markup = await readProjectFile('index.html');
  assert.match(markup, /role="dialog"/);
  assert.match(markup, /aria-modal="true"/);
  assert.match(markup, /aria-labelledby="overlay-title"/);
});

test('landscape iPhones get a canvas matching their wide viewport', () => {
  assert.equal(isPhoneLandscapeViewport(852, 393, true), true);
  assert.deepEqual(getGameCanvasSize(852, 393, true), { width: 1560, height: 720 });
  assert.deepEqual(getGameCanvasSize(932, 430, true), { width: 1560, height: 720 });
  assert.deepEqual(getGameCanvasSize(667, 375, true), { width: 1281, height: 720 });
});

test('desktop and portrait layouts retain the original 4:3 canvas', () => {
  assert.deepEqual(getGameCanvasSize(852, 393, false), { width: 960, height: 720 });
  assert.deepEqual(getGameCanvasSize(1440, 900, false), { width: 960, height: 720 });
  assert.deepEqual(getGameCanvasSize(820, 1180, true), { width: 960, height: 720 });
  assert.equal(isPhonePortraitViewport(390, 844, true), true);
});

test('the mobile release contract includes landscape and safe-area support', async () => {
  const [markup, styles, gameSource, manifestSource] = await Promise.all([
    readProjectFile('index.html'),
    readProjectFile('styles.css'),
    readProjectFile('src/game.js'),
    readProjectFile('public/manifest.webmanifest'),
  ]);
  const manifest = JSON.parse(manifestSource);

  assert.match(markup, /viewport-fit=cover/);
  assert.match(markup, /rel="manifest"/);
  assert.match(markup, /id="orientation-gate"/);
  assert.match(markup, /id="portrait-continue"/);
  assert.match(styles, /orientation:\s*landscape/);
  assert.match(styles, /safe-area-inset-left/);
  assert.match(styles, /safe-area-inset-right/);
  assert.match(styles, /safe-area-inset-bottom/);
  assert.match(gameSource, /isPhonePortraitViewport/);
  assert.match(gameSource, /visualViewport/);
  assert.equal(manifest.orientation, 'landscape');
  assert.equal(manifest.display, 'standalone');
  assert.deepEqual(manifest.display_override, ['fullscreen', 'standalone']);
  assert.equal(manifest.icons[0].src, './mr-bb-icon.svg');
});

test('touch players get discoverable swipe controls with button and keyboard fallbacks', async () => {
  const [markup, styles, gameSource] = await Promise.all([
    readProjectFile('index.html'),
    readProjectFile('styles.css'),
    readProjectFile('src/game.js'),
  ]);

  assert.match(markup, /Swipe → run · ← back · ↑ jump · ↓ crouch/);
  assert.match(markup, /Double swipe ↑ high jump · → sprint/);
  assert.match(markup, /data-control="crouch"/);
  assert.match(styles, /#game-stage[^{]*\{[^}]*touch-action:\s*none/s);
  assert.match(gameSource, /pointerType === 'touch'/);
  assert.match(gameSource, /addEventListener\('pointerdown', handleGestureStart\)/);
  assert.match(gameSource, /LJS\.keyIsDown\('ArrowDown'\)/);
  assert.match(
    gameSource,
    /function cancelGestureMotionForManualInput\(\).*clearActiveGesture\(\)/s,
  );
  assert.match(styles, /@media \(pointer:\s*coarse\)[^{]*\{.*\.touch-hint\s*\{[^}]*display:\s*block/s);
  assert.match(gameSource, /clearAllControls\(\).*Player/s);
});
