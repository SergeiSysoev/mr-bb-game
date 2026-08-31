const DESKTOP_CANVAS = Object.freeze({ width: 960, height: 720 });
const PHONE_MAX_HEIGHT = 560;
const COMPACT_MAX_WIDTH = 1000;
const MIN_LANDSCAPE_ASPECT = 4 / 3;
const MAX_LANDSCAPE_ASPECT = 19.5 / 9;

function hasUsableDimensions(width, height) {
  return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0;
}

export function isPhoneLandscapeViewport(width, height, hasCoarsePointer) {
  return (
    hasUsableDimensions(width, height) &&
    hasCoarsePointer &&
    width > height &&
    width <= COMPACT_MAX_WIDTH &&
    height <= PHONE_MAX_HEIGHT
  );
}

export function isPhonePortraitViewport(width, height, hasCoarsePointer) {
  return (
    hasUsableDimensions(width, height) &&
    hasCoarsePointer &&
    height > width &&
    width <= PHONE_MAX_HEIGHT
  );
}

export function getGameCanvasSize(width, height, hasCoarsePointer) {
  if (!isPhoneLandscapeViewport(width, height, hasCoarsePointer)) {
    return { ...DESKTOP_CANVAS };
  }

  const viewportAspect = width / height;
  const canvasAspect = Math.min(
    MAX_LANDSCAPE_ASPECT,
    Math.max(MIN_LANDSCAPE_ASPECT, viewportAspect),
  );

  return {
    width: Math.round(DESKTOP_CANVAS.height * canvasAspect),
    height: DESKTOP_CANVAS.height,
  };
}
