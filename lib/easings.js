'use strict'

/* Easing functions for fantasma.js
 */

const invert =(f,t)=> 1 - f(1 - t)

const EASINGS = {
  linear:       t => t,
  easeInCubic:  t => Math.pow(t, 3),
  easeOutCubic: t => invert(EASINGS.easeInCubic, t),
  easeInQuad:   t => t * t,
  easeOutQuad:  t => invert(EASINGS.easeInQuad, t),
}


module.exports = EASINGS
