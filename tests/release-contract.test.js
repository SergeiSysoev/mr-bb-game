import { createHash } from 'node:crypto';
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
const readProjectAsset = (path) => readFile(projectFile(path));

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

test('the larger cartoon Mr. BB asset keeps transparent sprite dimensions and a compact hitbox', async () => {
  const [markup, gameSource, hero] = await Promise.all([
    readProjectFile('index.html'),
    readProjectFile('src/game.js'),
    readProjectAsset('assets/mr-bb-v2.png'),
  ]);

  assert.match(markup, /assets\/mr-bb-v2\.png/);
  assert.match(markup, /Bald cartoon Mr\. BB with light eyebrows, light stubble/);
  assert.match(gameSource, /HERO_SOURCE.*assets\/mr-bb-v2\.png/);
  assert.match(gameSource, /standingSize = vec2\(0\.68, 1\.03\)/);
  assert.match(gameSource, /standingDrawSize = vec2\(1\.92, 1\.75\)/);
  assert.match(gameSource, /heroTile = LJS\.tile\(vec2\(0\), vec2\(488, 446\)/);
  assert.equal(hero.subarray(1, 4).toString('ascii'), 'PNG');
  assert.equal(hero.readUInt32BE(16), 488);
  assert.equal(hero.readUInt32BE(20), 446);
  assert.equal(hero[25], 6, 'hero PNG must retain an RGBA alpha channel');
  assert.equal(
    createHash('sha256').update(hero).digest('hex'),
    '0bfdf59aaebf5eb8d9e82fd9180d479afae8ba4d3d5622051e0930e083d92a2c',
    'hero sprite must match the approved bald, light-eyebrow, light-stubble artwork',
  );
});

test('the launch splash and social preview keep the approved tool-scatter artwork', async () => {
  const [markup, launchSplash, socialCard] = await Promise.all([
    readProjectFile('index.html'),
    readProjectAsset('assets/mr-bb-splash.png'),
    readProjectAsset('public/og.png'),
  ]);

  assert.match(markup, /src="\/assets\/mr-bb-splash\.png"/);
  for (const artwork of [launchSplash, socialCard]) {
    assert.equal(artwork.subarray(1, 4).toString('ascii'), 'PNG');
    assert.equal(artwork.readUInt32BE(16), 1200);
    assert.equal(artwork.readUInt32BE(20), 675);
    assert.equal(
      createHash('sha256').update(artwork).digest('hex'),
      'c16f5d5081fe3bb944dfec6072f1d9cc6f944eee4aab7e0e94f1a51948572d97',
      'launch artwork must match the approved bald Mr. BB with flying screws and tools',
    );
  }
});

test('level one presents varied parts and falling construction hazards', async () => {
  const [markup, gameSource, levelData] = await Promise.all([
    readProjectFile('index.html'),
    readProjectFile('src/game.js'),
    readProjectFile('src/level-data.js'),
  ]);

  assert.match(markup, /id="parts-value">0 \/ 10/);
  assert.doesNotMatch(markup, /id="duct-value"/);
  assert.match(gameSource, /class JobPart extends LJS\.EngineObject/);
  assert.match(gameSource, /class FallingHazard extends LJS\.EngineObject/);
  assert.match(levelData, /rectangular[\s\S]*round[\s\S]*elbow[\s\S]*screws/);
  assert.match(levelData, /mastic[\s\S]*hammer[\s\S]*lumber/);
});

test('GitHub Pages keeps the repository path prefix', async () => {
  const markup = await readProjectFile('index.html');
  const viteConfig = await readProjectFile('vite.config.js');
  assert.match(markup, /rel="manifest" href="%BASE_URL%manifest\.webmanifest"/);
  assert.match(viteConfig, /GITHUB_PAGES.*\/mr-bb-game\//s);
});

test('the blocking game overlay exposes dialog semantics', async () => {
  const markup = await readProjectFile('index.html');
  assert.match(markup, /role="dialog"/);
  assert.match(markup, /aria-modal="true"/);
  assert.match(markup, /aria-labelledby="overlay-title"/);
  assert.match(markup, /id="game-overlay"[\s\S]*class="game-overlay is-hidden"[\s\S]*aria-hidden="true"[\s\S]*inert/);
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

test('the launch is buttonless and touch play is swipe-only', async () => {
  const [markup, styles, gameSource] = await Promise.all([
    readProjectFile('index.html'),
    readProjectFile('styles.css'),
    readProjectFile('src/game.js'),
  ]);
  const splashMarkup = markup.match(/<div id="launch-splash"[\s\S]*?<\/div>/)?.[0];

  assert.ok(splashMarkup, 'launch splash markup must exist');
  assert.match(splashMarkup, /id="launch-splash-image"/);
  assert.doesNotMatch(splashMarkup, /<button/);
  assert.match(markup, /<main class="page" aria-hidden="true" inert>/);
  assert.doesNotMatch(markup, /READY, MR\. BB\?|START RUN|USE TAP CONTROLS/);
  assert.match(markup, /swipe right to run, left to go back, up to jump, or down to crouch/i);
  assert.match(markup, /Swipe up twice for a high jump or right twice to sprint/);
  assert.doesNotMatch(markup, /class="touch-controls"/);
  assert.doesNotMatch(markup, /data-control=/);
  assert.doesNotMatch(markup, /tap-controls-toggle|accessible-controls|data-accessible-action/);
  assert.doesNotMatch(styles, /tap-controls-toggle|accessible-controls|keyboard-hint|touch-hint/);
  assert.doesNotMatch(
    gameSource,
    /setAccessibleControlsEnabled|activateAccessibleControl|accessibleControlsEnabled|tapControlsToggle/,
  );
  assert.match(styles, /#game-stage[^{]*\{[^}]*touch-action:\s*none/s);
  assert.match(styles, /\.launch-splash[^{]*\{[^}]*position:\s*fixed/s);
  assert.match(styles, /\.launch-splash img[^{]*\{[^}]*object-fit:\s*contain/s);
  assert.match(gameSource, /pointerType === 'touch'/);
  assert.match(gameSource, /addEventListener\('pointerdown', handleGestureStart\)/);
  assert.match(gameSource, /LJS\.keyIsDown\('ArrowDown'\)/);
  assert.match(
    gameSource,
    /function cancelGestureMotionForManualInput\(\).*clearActiveGesture\(\)/s,
  );
  assert.doesNotMatch(gameSource, /pointerControls|clearPointerControls/);
  assert.match(gameSource, /clearAllControls\(\).*Player/s);
  assert.match(gameSource, /const LAUNCH_SPLASH_MIN_MS = 1800/);
  assert.match(
    gameSource,
    /function syncPageInteractivity\(orientationBlocked\)[\s\S]*orientationBlocked \|\| !initialRunStarted/,
  );
  assert.match(
    gameSource,
    /function completeInitialLaunch\(\)[\s\S]*syncPageInteractivity\(false\)[\s\S]*launchSplash\.classList\.add\('is-hidden'\)[\s\S]*beginRun\(\)/,
  );
  const readyIndex = gameSource.indexOf('engineReady = true;');
  const launchIndex = gameSource.indexOf('scheduleInitialRun();', readyIndex);
  assert.ok(
    readyIndex >= 0 && launchIndex > readyIndex,
    'auto-start must be scheduled only after the engine is ready',
  );
});
