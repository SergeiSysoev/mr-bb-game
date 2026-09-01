const DESKTOP_CANVAS = Object.freeze({ width: 960, height: 720 });
const PHONE_MAX_HEIGHT = 560;
const PHONE_MAX_SCREEN_MINOR_AXIS = 560;
const COMPACT_MAX_WIDTH = 1000;
const EMBEDDED_MAX_WIDTH = 1400;
const MIN_LANDSCAPE_ASPECT = 4 / 3;
const MAX_LANDSCAPE_ASPECT = 19.5 / 9;
const MAX_EMBEDDED_LANDSCAPE_ASPECT = 3;

function hasUsableDimensions(width, height) {
  return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0;
}

function resolveScreenMinorAxis(width, height, screenMinorAxis) {
  return Number.isFinite(screenMinorAxis) && screenMinorAxis > 0
    ? screenMinorAxis
    : Math.min(width, height);
}

function hasPhoneSizedScreen(width, height, screenMinorAxis) {
  return (
    hasUsableDimensions(width, height) &&
    resolveScreenMinorAxis(width, height, screenMinorAxis) <= PHONE_MAX_SCREEN_MINOR_AXIS
  );
}

export function isPhoneLandscapeViewport(
  width,
  height,
  hasCoarsePointer,
  screenMinorAxis,
  embedded = false,
) {
  return (
    hasPhoneSizedScreen(width, height, screenMinorAxis) &&
    hasCoarsePointer &&
    width > height &&
    width <= (embedded ? EMBEDDED_MAX_WIDTH : COMPACT_MAX_WIDTH) &&
    height <= PHONE_MAX_HEIGHT
  );
}

export function isPhonePortraitViewport(width, height, hasCoarsePointer, screenMinorAxis) {
  return (
    hasPhoneSizedScreen(width, height, screenMinorAxis) &&
    hasCoarsePointer &&
    height > width &&
    width <= PHONE_MAX_HEIGHT
  );
}

export function getGameCanvasSize(
  width,
  height,
  hasCoarsePointer,
  screenMinorAxis,
  embedded = false,
) {
  if (
    !isPhoneLandscapeViewport(
      width,
      height,
      hasCoarsePointer,
      screenMinorAxis,
      embedded,
    )
  ) {
    return { ...DESKTOP_CANVAS };
  }

  const viewportAspect = width / height;
  const maximumAspect = embedded
    ? MAX_EMBEDDED_LANDSCAPE_ASPECT
    : MAX_LANDSCAPE_ASPECT;
  const canvasAspect = Math.min(
    maximumAspect,
    Math.max(MIN_LANDSCAPE_ASPECT, viewportAspect),
  );

  return {
    width: Math.round(DESKTOP_CANVAS.height * canvasAspect),
    height: DESKTOP_CANVAS.height,
  };
}
