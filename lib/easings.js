'use strict'

/* Easing functions for fantasma.js
 */


const EASINGS = {
  linear:       t => t,
  easeInCubic:  t => Math.pow(t, 3),
  easeOutCubic: t => 1 - EASINGS.easeInCubic(1 - t),
  easeInQuad:   t => t * t,
  easeOutQuad:  t => 1 - EASINGS.easeInQuad(1 - t)
}


module.exports = EASINGS
