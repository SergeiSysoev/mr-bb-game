import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { inflateSync } from 'node:zlib';
import {
  getGameCanvasSize,
  isPhoneLandscapeViewport,
  isPhonePortraitViewport,
} from '../src/viewport.js';

const projectFile = (path) => new URL(`../${path}`, import.meta.url);
const readProjectFile = (path) => readFile(projectFile(path), 'utf8');
const readProjectAsset = (path) => readFile(projectFile(path));
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const RUN_SPRITES = [
  {
    path: 'assets/mr-bb-run-contact-a.png',
    sha256: '4d884c963922662a322e2f4bd600ff97bd6f8ce9efae95b144a92b1c81fa5250',
  },
  {
    path: 'assets/mr-bb-run-passing-a.png',
    sha256: 'df8c53f21bc197cd31112e8ba1a33a9281c4d88d37243047f92b0de92fbcb638',
  },
  {
    path: 'assets/mr-bb-run-contact-b.png',
    sha256: '7c3a868cecabee60d3b3b42e491993c2f580da101fe134c074a331c396959114',
  },
  {
    path: 'assets/mr-bb-run-passing-b.png',
    sha256: '569871bd8ef90cf6fd7701ee35d9eb1f65f1759b515a0e22a8028a267c2fbd8b',
  },
];

const paethPredictor = (left, up, upperLeft) => {
  const prediction = left + up - upperLeft;
  const leftDistance = Math.abs(prediction - left);
  const upDistance = Math.abs(prediction - up);
  const upperLeftDistance = Math.abs(prediction - upperLeft);
  if (leftDistance <= upDistance && leftDistance <= upperLeftDistance) return left;
  return upDistance <= upperLeftDistance ? up : upperLeft;
};

const getRgbaPngAlphaStats = (png) => {
  assert.deepEqual(png.subarray(0, PNG_SIGNATURE.length), PNG_SIGNATURE, 'hero must have a valid PNG signature');
  const idatChunks = [];
  let width;
  let height;
  let bitDepth;
  let colorType;
  let interlace;
  let chunkOffset = 8;
  let reachedEnd = false;

  while (chunkOffset < png.length) {
    assert.ok(chunkOffset + 12 <= png.length, 'PNG chunk header must be complete');
    const chunkLength = png.readUInt32BE(chunkOffset);
    assert.ok(chunkOffset + chunkLength + 12 <= png.length, 'PNG chunk data must stay in bounds');
    const chunkType = png.subarray(chunkOffset + 4, chunkOffset + 8).toString('ascii');
    const chunkData = png.subarray(chunkOffset + 8, chunkOffset + 8 + chunkLength);
    if (chunkType === 'IHDR') {
      width = chunkData.readUInt32BE(0);
      height = chunkData.readUInt32BE(4);
      bitDepth = chunkData[8];
      colorType = chunkData[9];
      interlace = chunkData[12];
    } else if (chunkType === 'IDAT') {
      idatChunks.push(chunkData);
    } else if (chunkType === 'IEND') {
      reachedEnd = true;
      break;
    }
    chunkOffset += chunkLength + 12;
  }

  assert.equal(bitDepth, 8, 'hero PNG must remain 8-bit');
  assert.equal(colorType, 6, 'hero PNG must remain RGBA');
  assert.equal(interlace, 0, 'hero PNG must remain non-interlaced for contract decoding');
  assert.equal(reachedEnd, true, 'hero PNG must contain an IEND chunk');
  assert.ok(Number.isInteger(width) && width > 0, 'hero PNG must declare a positive width');
  assert.ok(Number.isInteger(height) && height > 0, 'hero PNG must declare a positive height');
  assert.ok(idatChunks.length > 0, 'hero PNG must contain image data');
  const bytesPerPixel = 4;
  const rowLength = width * bytesPerPixel;
  const decoded = inflateSync(Buffer.concat(idatChunks));
  assert.equal(decoded.length, height * (rowLength + 1), 'hero PNG scanline data must be complete');
  const previousRow = Buffer.alloc(rowLength);
  const currentRow = Buffer.alloc(rowLength);
  let decodedOffset = 0;
  let fullyTransparentPixels = 0;
  let opaquePixels = 0;
  const cornerAlphas = [];

  for (let y = 0; y < height; y += 1) {
    const filterType = decoded[decodedOffset++];
    for (let x = 0; x < rowLength; x += 1) {
      const source = decoded[decodedOffset++];
      const left = x >= bytesPerPixel ? currentRow[x - bytesPerPixel] : 0;
      const up = previousRow[x];
      const upperLeft = x >= bytesPerPixel ? previousRow[x - bytesPerPixel] : 0;
      let reconstructed;
      if (filterType === 0) reconstructed = source;
      else if (filterType === 1) reconstructed = source + left;
      else if (filterType === 2) reconstructed = source + up;
      else if (filterType === 3) reconstructed = source + Math.floor((left + up) / 2);
      else if (filterType === 4) reconstructed = source + paethPredictor(left, up, upperLeft);
      else throw new Error(`Unsupported PNG filter type: ${filterType}`);
      currentRow[x] = reconstructed & 0xff;
    }
    for (let x = 3; x < rowLength; x += bytesPerPixel) {
      if (currentRow[x] === 0) fullyTransparentPixels += 1;
      else if (currentRow[x] === 255) opaquePixels += 1;
    }
    if (y === 0 || y === height - 1) {
      cornerAlphas.push(currentRow[3], currentRow[rowLength - 1]);
    }
    currentRow.copy(previousRow);
  }

  return { cornerAlphas, fullyTransparentPixels, opaquePixels, pixelCount: width * height };
};

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

test('the larger cartoon Mr. BB asset keeps the approved gray-blue-eyed black-T-shirt outfit', async () => {
  const [markup, gameSource, hero] = await Promise.all([
    readProjectFile('index.html'),
    readProjectFile('src/game.js'),
    readProjectAsset('assets/mr-bb-v2.png'),
  ]);

  const heroTag = markup.match(/<img\b(?=[^>]*\bsrc="\/assets\/mr-bb-v2\.png")[^>]*>/s)?.[0];
  assert.ok(heroTag, 'the game overlay must include the approved runtime hero image');
  assert.match(heroTag, /Bald cartoon Mr\. BB with gray-blue eyes, light eyebrows, light stubble/);
  assert.match(heroTag, /black short-sleeve T-shirt/);
  assert.match(heroTag, /plain blue jeans, dark gloves, plain brown work boots, and a black front waist tool apron/);
  assert.match(gameSource, /HERO_SOURCE.*assets\/mr-bb-v2\.png/);
  assert.match(gameSource, /standingSize = vec2\(0\.68, 1\.03\)/);
  assert.match(gameSource, /standingDrawSize = vec2\(1\.92, 1\.75\)/);
  assert.match(gameSource, /heroTile = LJS\.tile\(vec2\(0\), vec2\(488, 446\)/);
  assert.equal(hero.subarray(1, 4).toString('ascii'), 'PNG');
  assert.equal(hero.readUInt32BE(16), 488);
  assert.equal(hero.readUInt32BE(20), 446);
  assert.equal(hero[25], 6, 'hero PNG must retain an RGBA alpha channel');
  const alphaStats = getRgbaPngAlphaStats(hero);
  assert.ok(
    alphaStats.fullyTransparentPixels > alphaStats.pixelCount / 4,
    'hero PNG must keep substantial fully transparent exterior space',
  );
  assert.deepEqual(alphaStats.cornerAlphas, [0, 0, 0, 0], 'all four hero PNG corners must be transparent');
  assert.ok(alphaStats.opaquePixels > 0, 'hero PNG must retain visible character pixels');
  assert.equal(
    createHash('sha256').update(hero).digest('hex'),
    'd4343778a84edf6b339918b4afedbe46d1b0d1b1ff099010c6c7abb81f042de9',
    'hero sprite must match the approved gray-blue eyes, black T-shirt, and brown-toe boots',
  );
});

test('the four-frame Mr. BB run cycle stays transparent, approved, and preloaded', async () => {
  const [gameSource, ...runSprites] = await Promise.all([
    readProjectFile('src/game.js'),
    ...RUN_SPRITES.map(({ path }) => readProjectAsset(path)),
  ]);
  const heroSources = gameSource.match(/const HERO_SOURCES = \[[\s\S]*?\n\];/)?.[0];

  assert.ok(heroSources, 'game.js must declare the complete HERO_SOURCES preload list');
  assert.match(heroSources, /\bHERO_SOURCE\b/, 'the approved idle Mr. BB sprite must remain first');
  assert.deepEqual(
    [...heroSources.matchAll(/assets\/(mr-bb-run-[^']+\.png)/g)].map((match) => match[1]),
    RUN_SPRITES.map(({ path }) => path.split('/').at(-1)),
    'run textures must stay in authored gait order: contact A, passing A, contact B, passing B',
  );
  assert.match(
    gameSource,
    /const HERO_SOURCE = new URL\('\.\.\/assets\/mr-bb-v2\.png', import\.meta\.url\)\.href/,
  );

  for (const [{ path, sha256 }, sprite] of RUN_SPRITES.map((definition, index) => [
    definition,
    runSprites[index],
  ])) {
    const filename = path.split('/').at(-1);
    assert.match(heroSources, new RegExp(`assets/${filename}`), `${filename} must be preloaded`);
    assert.deepEqual(
      sprite.subarray(0, PNG_SIGNATURE.length),
      PNG_SIGNATURE,
      `${filename} must retain a valid PNG signature`,
    );
    assert.equal(sprite.readUInt32BE(16), 488, `${filename} must remain exactly 488px wide`);
    assert.equal(sprite.readUInt32BE(20), 446, `${filename} must remain exactly 446px tall`);
    assert.equal(sprite[24], 8, `${filename} must remain 8-bit`);
    assert.equal(sprite[25], 6, `${filename} must retain a true RGBA alpha channel`);

    const alphaStats = getRgbaPngAlphaStats(sprite);
    assert.ok(
      alphaStats.fullyTransparentPixels > alphaStats.pixelCount / 4,
      `${filename} must keep substantial fully transparent exterior space`,
    );
    assert.deepEqual(
      alphaStats.cornerAlphas,
      [0, 0, 0, 0],
      `${filename} must keep all four corners fully transparent`,
    );
    assert.ok(alphaStats.opaquePixels > 0, `${filename} must retain visible character pixels`);
    assert.equal(
      createHash('sha256').update(sprite).digest('hex'),
      sha256,
      `${filename} must match its approved run-cycle frame`,
    );
  }

  assert.match(gameSource, /let heroTiles = \[\]/);
  assert.match(
    gameSource,
    /heroTiles = \[[\s\S]*?heroTile,[\s\S]*?HERO_SOURCES\.slice\(1\)[\s\S]*?sourceIndex \+ 1[\s\S]*?\];/,
    'every preloaded run texture must receive a matching hero tile',
  );
  assert.match(
    gameSource,
    /heroTiles\[getPlayerTextureIndex\(this\.animationState\)\]/,
    'the player renderer must select from the run-cycle tiles',
  );
  assert.match(
    gameSource,
    /LJS\.engineInit\([\s\S]*?HERO_SOURCES,\s*gameStage\);/,
    'LittleJS must preload the complete hero source list',
  );
  assert.doesNotMatch(
    gameSource,
    /LJS\.engineInit\([\s\S]*?\[HERO_SOURCE\],\s*gameStage\);/,
    'the runtime must not fall back to preloading only the idle hero texture',
  );
});

test('the launch splash and social preview keep the approved gray-blue-eyed black-T-shirt artwork', async () => {
  const [markup, launchSplash, socialCard] = await Promise.all([
    readProjectFile('index.html'),
    readProjectAsset('assets/mr-bb-splash.png'),
    readProjectAsset('public/og.png'),
  ]);

  const splashTag = markup.match(/<img\b(?=[^>]*\bid="launch-splash-image")[^>]*>/s)?.[0];
  assert.ok(splashTag, 'the launch overlay must include the approved splash image');
  assert.match(splashTag, /src="\/assets\/mr-bb-splash\.png"/);
  assert.match(splashTag, /Bald gray-blue-eyed Mr\. BB in a black short-sleeve T-shirt/);
  assert.match(splashTag, /black front waist tool apron/);
  assert.deepEqual(socialCard, launchSplash, 'launch splash and social card must stay byte-identical');
  for (const artwork of [launchSplash, socialCard]) {
    assert.equal(artwork.subarray(1, 4).toString('ascii'), 'PNG');
    assert.equal(artwork.readUInt32BE(16), 1200);
    assert.equal(artwork.readUInt32BE(20), 675);
    assert.equal(
      createHash('sha256').update(artwork).digest('hex'),
      '32ac600f239f9a420eeb2be98566c7d967e4ef3d1794145cd57af152fd8ed7a3',
      'launch artwork must match the approved gray-blue eyes and black T-shirt scene',
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
