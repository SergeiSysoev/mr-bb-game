import { isLandscapeViewport } from './viewport.js';

const START_TIMEOUT_MS = 12000;
const ARTWORK_TIMEOUT_MS = 12000;
const documentRoot = document.documentElement;
const launchSplash = document.querySelector('#launch-splash');
const launchSplashImage = document.querySelector('#launch-splash-image');
const launchStartButton = document.querySelector('#launch-start-button');
const launchOrientationStatus = document.querySelector('#launch-orientation-status');

let artworkReady = false;
let artworkFailed = false;
let startFailed = false;
let launchState = 'waiting';
let launchAttempt = 0;

documentRoot.classList.add('is-launch-active');

function getViewportDimensions() {
  const viewport = window.visualViewport;
  return {
    width: viewport?.width || window.innerWidth,
    height: viewport?.height || window.innerHeight,
  };
}

function isLandscapeNow() {
  const { width, height } = getViewportDimensions();
  return isLandscapeViewport(width, height);
}

function setLaunchState(nextState) {
  launchState = nextState;
  documentRoot.dataset.mrBbLaunchState = nextState;
}

function syncLaunchGate() {
  const landscape = isLandscapeNow();
  const isWaiting = launchState === 'waiting' || launchState === 'error';
  const startEnabled = artworkReady && !startFailed && landscape && isWaiting && !document.hidden;

  documentRoot.dataset.mrBbOrientation = landscape ? 'landscape' : 'portrait';
  documentRoot.classList.toggle('is-launch-portrait', !landscape);
  launchStartButton.disabled = !startEnabled;
  launchStartButton.setAttribute('aria-disabled', String(!startEnabled));
  launchStartButton.textContent = launchState === 'starting' ? 'STARTING…' : 'START';
  launchSplash.setAttribute(
    'aria-busy',
    String((!artworkReady && !artworkFailed) || launchState === 'starting'),
  );

  if (artworkFailed) {
    launchOrientationStatus.textContent = 'COULD NOT LOAD THE JOBSITE. REOPEN THE GAME TO TRY AGAIN.';
  } else if (!artworkReady) {
    launchOrientationStatus.textContent = 'LOADING THE JOBSITE…';
  } else if (!landscape) {
    launchOrientationStatus.textContent = 'TURN PHONE SIDEWAYS TO START';
  } else if (launchState === 'starting') {
    launchOrientationStatus.textContent = 'STARTING THE JOBSITE…';
  } else if (launchState === 'error') {
    launchOrientationStatus.textContent = 'COULD NOT START THE JOBSITE. REOPEN THE GAME TO TRY AGAIN.';
  } else {
    launchOrientationStatus.textContent = 'READY FOR THE JOBSITE';
  }
}

function scheduleLaunchGateSync() {
  requestAnimationFrame(syncLaunchGate);
}

function waitForArtworkLoad() {
  if (launchSplashImage.complete) {
    return launchSplashImage.naturalWidth > 0
      ? Promise.resolve()
      : Promise.reject(new Error('Launch artwork failed to load.'));
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      window.clearTimeout(timeoutId);
      launchSplashImage.removeEventListener('load', handleLoad);
      launchSplashImage.removeEventListener('error', handleError);
    };
    const handleLoad = () => {
      cleanup();
      resolve();
    };
    const handleError = () => {
      cleanup();
      reject(new Error('Launch artwork failed to load.'));
    };
    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error('Launch artwork took too long to load.'));
    }, ARTWORK_TIMEOUT_MS);

    launchSplashImage.addEventListener('load', handleLoad);
    launchSplashImage.addEventListener('error', handleError);
    if (launchSplashImage.complete) {
      if (launchSplashImage.naturalWidth > 0) {
        handleLoad();
      } else {
        handleError();
      }
    }
  });
}

async function prepareArtwork() {
  try {
    await withTimeout(
      (async () => {
        await waitForArtworkLoad();
        try {
          await launchSplashImage.decode();
        } catch {
          if (launchSplashImage.naturalWidth <= 0) {
            throw new Error('Launch artwork could not be decoded.');
          }
        }

        if (launchSplashImage.naturalWidth <= 0) {
          throw new Error('Launch artwork is empty.');
        }
      })(),
      ARTWORK_TIMEOUT_MS,
      'Launch artwork took too long to prepare.',
    );

    artworkReady = true;
    syncLaunchGate();
    documentRoot.dataset.mrBbLaunchReady = 'true';
  } catch {
    artworkFailed = true;
    setLaunchState('error');
    syncLaunchGate();
  }
}

function withTimeout(promise, timeoutMs, timeoutMessage, onTimeout) {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      onTimeout?.();
      reject(new Error(timeoutMessage));
    }, timeoutMs);

    Promise.resolve(promise).then(
      (value) => {
        window.clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timeoutId);
        reject(error);
      },
    );
  });
}

async function startLaunch() {
  if (
    launchStartButton.disabled ||
    launchState === 'starting' ||
    launchState === 'started' ||
    !isLandscapeNow() ||
    document.hidden
  ) {
    syncLaunchGate();
    return;
  }

  const attempt = ++launchAttempt;
  const startupController = new AbortController();
  setLaunchState('starting');
  syncLaunchGate();

  try {
    const game = await withTimeout(
      (async () => {
        const loadedGame = await import('./game.js');
        if (
          startupController.signal.aborted ||
          attempt !== launchAttempt ||
          !isLandscapeNow() ||
          document.hidden
        ) {
          return undefined;
        }
        await loadedGame.startGame(startupController.signal);
        return loadedGame;
      })(),
      START_TIMEOUT_MS,
      'The jobsite took too long to start.',
      () => startupController.abort(),
    );
    if (!game || attempt !== launchAttempt || !isLandscapeNow() || document.hidden) {
      setLaunchState('waiting');
      syncLaunchGate();
      return;
    }

    if (!game.activateGame()) {
      setLaunchState('waiting');
      syncLaunchGate();
      return;
    }

    setLaunchState('started');
    documentRoot.classList.remove('is-launch-active');
    launchSplash.classList.add('is-hidden');
    launchSplash.setAttribute('aria-hidden', 'true');
    launchSplash.removeAttribute('aria-busy');
    launchSplash.inert = true;
  } catch {
    if (attempt === launchAttempt) {
      startupController.abort();
      launchAttempt += 1;
      startFailed = true;
      setLaunchState('error');
      syncLaunchGate();
    }
  }
}

launchStartButton.addEventListener('click', startLaunch);
launchStartButton.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    void startLaunch();
  }
});
window.addEventListener('resize', scheduleLaunchGateSync);
window.addEventListener('orientationchange', scheduleLaunchGateSync);
window.visualViewport?.addEventListener('resize', scheduleLaunchGateSync);
screen.orientation?.addEventListener('change', scheduleLaunchGateSync);
document.addEventListener('visibilitychange', syncLaunchGate);

setLaunchState('waiting');
syncLaunchGate();
void prepareArtwork();
