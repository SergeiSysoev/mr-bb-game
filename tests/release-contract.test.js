import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

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
