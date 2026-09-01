import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const SOURCE_SIZE = 1254;
const SCALED_SIZE = 458;
const OUTPUT_WIDTH = 488;
const OUTPUT_HEIGHT = 446;
const WORK_WIDTH = 700;
const WORK_X = Math.floor((WORK_WIDTH - SCALED_SIZE) / 2);
const OUTPUT_CROP_X = Math.floor((WORK_WIDTH - OUTPUT_WIDTH) / 2);

const frames = [
  {
    source:
      '/Users/assistant/.codex/generated_images/01a058d1-07d8-70b2-afb0-1fd34fb31a16/exec-63f0b280-9f97-4ced-9ec2-0b12392eab17.png',
    output: 'assets/mr-bb-run-contact-a.png',
    cropY: 3,
    xShift: 4,
  },
  {
    source:
      '/Users/assistant/.codex/generated_images/01a058d1-07d8-70b2-afb0-1fd34fb31a16/exec-5620a25f-0b4a-43d6-8036-04223dcd7958.png',
    output: 'assets/mr-bb-run-passing-a.png',
    cropY: 3,
    xShift: 23,
  },
  {
    source:
      '/Users/assistant/.codex/generated_images/01a058d1-07d8-70b2-afb0-1fd34fb31a16/exec-5288da84-6637-489c-9761-2d22cee04032.png',
    output: 'assets/mr-bb-run-contact-b.png',
    cropY: 4,
    xShift: 10,
  },
  {
    source:
      '/Users/assistant/.codex/generated_images/01a058d1-07d8-70b2-afb0-1fd34fb31a16/exec-95312985-df5f-4a62-b9a3-164e85e8cda8.png',
    output: 'assets/mr-bb-run-passing-b.png',
    cropY: 3,
    xShift: 27,
  },
];

function runFfmpeg(args, options = {}) {
  const result = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', ...args], {
    ...options,
    maxBuffer: 64 * 1024 * 1024,
  });

  if (result.status !== 0) {
    throw new Error(result.stderr?.toString() || `ffmpeg exited with ${result.status}`);
  }

  return result.stdout;
}

function decodeRgb(source) {
  return runFfmpeg(['-i', source, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-frames:v', '1', 'pipe:1']);
}

function isConnectedBackdrop(rgb, pixelIndex) {
  const offset = pixelIndex * 3;
  const red = rgb[offset];
  const green = rgb[offset + 1];
  const blue = rgb[offset + 2];
  const minimum = Math.min(red, green, blue);
  const maximum = Math.max(red, green, blue);
  return minimum >= 210 && maximum - minimum <= 16;
}

function removeConnectedBackdrop(rgb) {
  const pixelCount = SOURCE_SIZE * SOURCE_SIZE;
  if (rgb.length !== pixelCount * 3) {
    throw new Error(`Expected ${SOURCE_SIZE}x${SOURCE_SIZE} RGB input, received ${rgb.length} bytes`);
  }

  const removed = new Uint8Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  let readIndex = 0;
  let writeIndex = 0;

  const enqueue = (pixelIndex) => {
    if (removed[pixelIndex] || !isConnectedBackdrop(rgb, pixelIndex)) {
      return;
    }
    removed[pixelIndex] = 1;
    queue[writeIndex] = pixelIndex;
    writeIndex += 1;
  };

  for (let x = 0; x < SOURCE_SIZE; x += 1) {
    enqueue(x);
    enqueue((SOURCE_SIZE - 1) * SOURCE_SIZE + x);
  }
  for (let y = 1; y < SOURCE_SIZE - 1; y += 1) {
    enqueue(y * SOURCE_SIZE);
    enqueue(y * SOURCE_SIZE + SOURCE_SIZE - 1);
  }

  while (readIndex < writeIndex) {
    const pixelIndex = queue[readIndex];
    readIndex += 1;
    const x = pixelIndex % SOURCE_SIZE;
    const y = Math.floor(pixelIndex / SOURCE_SIZE);
    if (x > 0) enqueue(pixelIndex - 1);
    if (x < SOURCE_SIZE - 1) enqueue(pixelIndex + 1);
    if (y > 0) enqueue(pixelIndex - SOURCE_SIZE);
    if (y < SOURCE_SIZE - 1) enqueue(pixelIndex + SOURCE_SIZE);
  }

  const rgba = Buffer.alloc(pixelCount * 4);
  for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += 1) {
    const rgbOffset = pixelIndex * 3;
    const rgbaOffset = pixelIndex * 4;
    if (!removed[pixelIndex]) {
      rgba[rgbaOffset] = rgb[rgbOffset];
      rgba[rgbaOffset + 1] = rgb[rgbOffset + 1];
      rgba[rgbaOffset + 2] = rgb[rgbOffset + 2];
      rgba[rgbaOffset + 3] = 255;
    }
  }
  return rgba;
}

function encodeFrame(rgba, output, cropY, xShift) {
  mkdirSync(dirname(output), { recursive: true });
  const filter = [
    `scale=${SCALED_SIZE}:${SCALED_SIZE}:flags=lanczos`,
    `pad=${WORK_WIDTH}:${SCALED_SIZE}:${WORK_X + xShift}:0:color=0x00000000`,
    `crop=${OUTPUT_WIDTH}:${OUTPUT_HEIGHT}:${OUTPUT_CROP_X}:${cropY}`,
    'format=rgba',
  ].join(',');

  runFfmpeg(
    [
      '-y',
      '-f',
      'rawvideo',
      '-pix_fmt',
      'rgba',
      '-s',
      `${SOURCE_SIZE}x${SOURCE_SIZE}`,
      '-i',
      'pipe:0',
      '-vf',
      filter,
      '-frames:v',
      '1',
      output,
    ],
    { input: rgba },
  );
}

for (const frame of frames) {
  const output = resolve(frame.output);
  const rgb = decodeRgb(frame.source);
  const rgba = removeConnectedBackdrop(rgb);
  encodeFrame(rgba, output, frame.cropY, frame.xShift);
  console.log(`${frame.output} <- ${frame.source}`);
}
