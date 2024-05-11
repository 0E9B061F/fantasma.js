**fantasma.js** is a sophisticated animation library for the web. **fantasma** animates multiple elements in parallel, and supports multiple animation segments per element. It supports easings on a per-animation and per-segment basis. Animations are reusable; after being created, they must be supplied with an appropriate set of elements to produce a `Playback` object, which will animate those specific elements. Additionally, **fantasma** allows animation of any element property, not just CSS values.

# Usage

```js
const { Animation } = require("fantasma.js")

// Create a new animation for two elements. One elements width will be
// animated, the other's height will be animated. Each element has four
// animation segments and the entire animation will last four seconds.
const animation = new Animation({
  easing: "easeOutQuad",
  strips: [
    { obj: "left", prop: ["style", "width"], unit: "px", path: [
      {from: 0, to: 100, time: 1000},
      {to: 50, time: 1000},
      {to: 100, time: 1000},
      {to: 0, time: 1000},
    ]},
    { obj: "right", prop: ["style", "height"], unit: "px", path: [
      {from: 100, to: 50, time: 1000},
      {to: 0, time: 1000},
      {to: 50, time: 1000},
      {to: 100, time: 1000},
    ]},
  ],
})

// Get the elements to be animated. They must be stored in an object with
// property names matching those give for each element in the animation
// defintiion.
const els = {
  left: document.getElementById("left"),
  right: document.getElementById("right"),
}

// Get a Playback object from the animation. Here we supply the elements to be
// animated plus various playback options, such as looping. This way a single
// animation can be resused for multiple sets of elements, which different
// playback settings.
// `loop: -1` means our animation will loop forever.
const player = animation.player({els, loop: -1})

// Finally, play our animation:
player.play()
```
