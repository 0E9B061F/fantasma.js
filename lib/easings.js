'use strict'

/* Easing functions for fantasma.js
 */

const invert =(f,t)=> 1 - f(1 - t)

const EASINGS = {
  linear:        t=> t,
  easeInCubic:   t=> Math.pow(t, 3),
  easeOutCubic:  t=> invert(EASINGS.easeInCubic, t),
  easeInQuad:    t=> t * t,
  easeOutQuad:   t=> invert(EASINGS.easeInQuad, t),
  easeOutSine:   t=> Math.sin((t * Math.PI) / 2),
  easeInSine:    t=> 1 - Math.cos((t * Math.PI) / 2),
  easeInOutSine: t=> -(Math.cos(Math.PI * x) - 1) / 2,
}


module.exports = EASINGS
