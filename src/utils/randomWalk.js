/**
 * Generates the next value in a bounded random walk.
 * @param {number} prev - Previous value.
 * @param {object} opts
 * @param {number} [opts.volatility=12] - Max absolute change per step.
 * @param {number} [opts.min=5] - Floor clamp.
 * @param {number} [opts.max=95] - Ceiling clamp.
 * @param {number} [opts.bias=0] - Added to the random delta (use to drift up/down).
 * @returns {number}
 */
export function randomWalk(prev, { volatility = 12, min = 5, max = 95, bias = 0 } = {}) {
  const delta = (Math.random() - 0.5) * volatility + bias;
  return Math.min(max, Math.max(min, (prev ?? (min + max) / 2) + delta));
}
