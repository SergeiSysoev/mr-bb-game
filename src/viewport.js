const DESKTOP_CANVAS = Object.freeze({ width: 960, height: 720 });
const PHONE_MAX_HEIGHT = 560;
const PHONE_MAX_SCREEN_MINOR_AXIS = 560;
const COMPACT_MAX_WIDTH = 1000;

function hasUsableDimensions(width, height) {
  return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0;
}

export function isLandscapeViewport(width, height) {
  return hasUsableDimensions(width, height) && width > height;
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
  const isLandscapePhoneViewport =
    hasUsableDimensions(width, height) &&
    hasCoarsePointer &&
    width > height;

  if (!isLandscapePhoneViewport) {
    return false;
  }

  // Browser-toolbar, page-zoom, and VisualViewport dimensions can be much
  // larger than the device's CSS screen. When physical screen geometry is
  // available it is the stable phone signal on both the app-domain embed and
  // standalone GitHub Pages; arbitrary viewport ceilings recreate side
  // gutters. Only legacy callers without screen geometry use the old compact
  // window fallback, while an embed can still use its short viewport edge.
  if (Number.isFinite(screenMinorAxis) && screenMinorAxis > 0) {
    return hasPhoneSizedScreen(width, height, screenMinorAxis);
  }

  return embedded
    ? hasPhoneSizedScreen(width, height, screenMinorAxis)
    : width <= COMPACT_MAX_WIDTH && height <= PHONE_MAX_HEIGHT;
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

  return {
    // Preserve the viewport aspect in the render buffer itself. CSS still
    // stretches the canvas element to the stage, so capping this ratio would
    // distort Mr. BB even when the element's bounding box looked full-width.
    width: Math.round(DESKTOP_CANVAS.height * (width / height)),
    height: DESKTOP_CANVAS.height,
  };
}
