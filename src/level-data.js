export const PART_DEFINITIONS = Object.freeze({
  rectangular: Object.freeze({
    label: 'Rectangular duct',
    width: 0.92,
    height: 0.7,
  }),
  round: Object.freeze({
    label: 'Round duct',
    width: 0.82,
    height: 0.82,
  }),
  elbow: Object.freeze({
    label: 'Duct elbow',
    width: 0.9,
    height: 0.86,
  }),
  screws: Object.freeze({
    label: 'Screw pack',
    width: 0.82,
    height: 0.62,
  }),
});

export const HAZARD_DEFINITIONS = Object.freeze({
  mastic: Object.freeze({
    label: 'Mastic bucket',
    width: 0.8,
    height: 0.85,
    gravityScale: 1.45,
    spin: 0.035,
  }),
  hammer: Object.freeze({
    label: 'Hammer',
    width: 0.86,
    height: 0.94,
    gravityScale: 1.58,
    spin: 0.072,
  }),
  lumber: Object.freeze({
    label: '2×4 lumber',
    width: 1.18,
    height: 0.46,
    gravityScale: 1.28,
    spin: 0.016,
  }),
});

export const PART_LAYOUT = Object.freeze([
  Object.freeze([4.0, 1.75, 'screws']),
  Object.freeze([6.1, 4.0, 'rectangular']),
  Object.freeze([8.1, 4.0, 'round']),
  Object.freeze([14.2, 5.8, 'elbow']),
  Object.freeze([20.0, 4.0, 'screws']),
  Object.freeze([22.1, 4.0, 'rectangular']),
  Object.freeze([28.7, 5.7, 'round']),
  Object.freeze([36.8, 4.2, 'elbow']),
  Object.freeze([44.3, 5.8, 'rectangular']),
  Object.freeze([50.3, 3.6, 'screws']),
]);

export const HAZARD_LAYOUT = Object.freeze([
  Object.freeze([10.6, 10.3, 'hammer']),
  Object.freeze([18.0, 9.7, 'mastic']),
  Object.freeze([25.0, 10.5, 'lumber']),
  Object.freeze([33.0, 9.8, 'hammer']),
  Object.freeze([41.0, 10.4, 'mastic']),
  Object.freeze([48.2, 9.9, 'lumber']),
]);
