# :ghost: **fantasma.js** v0.4.3 'YAOGUI'
[![Version][icon-ver]][repo]
[![Series][icon-ser]][repo]
[![License][icon-lic]][license]
[![Maintenance][icon-mnt]][commits]<br/>
[![NPM][icon-npm]][pkg]

**fantasma.js** is a sophisticated animation library for the web. **fantasma**
animates multiple elements in parallel, and supports multiple animation segments
per element. It supports easings on a per-animation and per-segment basis.
Animations are reusable; after being created, they must be supplied with an
appropriate set of elements to produce a `Playback` object, which will animate
those specific elements. Additionally, **fantasma** allows animation of any
element property, not just CSS values.

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

# Options

## Animation

Synopsis:

```js
new Animation({
  easing: "linear", scale: 1,
  strips: [ ... ]
})
```

* `easing`: One of the available easings. Affects the entire animation.
* `scale`: Time scale. All animation timings are scaled by this factor.
* `strips`: Animation Strips, explained below. One for each element.

## Strips

Synopsis:

```js
{ obj: "elem1", prop: ["style", "left"], unit: "px",
  easing: "easeInQuad", start: 100, 
  path: [ ... ]
}
```

* `obj`: The name of the element to be animated. A real element is given later
  when a Playback object is created.
* `prop`: The property of the object to be animated by this Strip. These are JS
  properties of the given element, not just CSS properties. An array of
  property names can be given to access nested objects.
* `unit`: By default this is `null`, and **fantasma** will animate the given
  property with raw numeric values. If a unit is given, the values will be set
  on the property as strings with the given unit affixed. This is useful for
  animating CSS values.
* `easing`: One of the available easings. Affects all segments of this strip.
* `start`: The time at which this strip should begin, after the overall
  animation begins. Defaults to 0.
* `scale`: Time scale. All segment timings are scaled by this factor.
* `path`: An array of animation Segments, described below.

## Segments

Synopsis:

```js
{ from: 0, to: 100, time: 500, easing: "easeOutSine", scale: 2 },
# Or:
{ from: 0, to: 100, speed: 200 },
```

* `from`: The starting value for this segment. If this is not given it will be
inferred from the previous segment, or the properties initial value.
* `to`: The end value of this segment.
* `time`: The duration of this segment, in milliseconds.
* `easing`: One of the available easings.
* `scale`: Segment duration will be scaled by this factor.
* `speed`: Specify the animation rate per second. If given, this will override
  `time`.

## Playback

Synopsis:

```js
const animation = new Animation( ... )
const player = animation.player({
  loop: -1,
  els: { ... }
})
player.play()
```

* `loop`: Number of loops. A value of `-1` means loop forever. The default value
  of `0` will play once then stop.
* `reverse`: Play the animation in reverse.
* `bounce`: Play in reverse every other loop.

### Lifecycle options

These options all take a callback function. All will be called with the Playback object itself as their first and only argument.

* `before`: Called before the entire animation begins.
* `after`: Called after the entire animation ends.
* `beforeSkip`: Called before a skip.
* `afterSkip`: Called after a skip.
* `beforePause`: Called before a pause.
* `afterPause`: Called after a pause.
* `afterLoop`: Called after each loop.
* `eachFrame`: Called every animation frame.

# License

Copyright 2020-2024 **[0E9B061F][gh]**<br/>
Available under the terms of the [MIT LIcense][license].


[gh]:https://github.com/0E9B061F
[repo]:https://github.com/0E9B061F/fantasma.js
[license]:https://github.com/0E9B061F/fantasma.js/blob/master/LICENSE
[pkg]:https://www.npmjs.com/package/fantasma.js
[commits]:https://github.com/0E9B061F/fantasma.js/commits/master

[icon-ver]:https://img.shields.io/github/package-json/v/0E9B061F/fantasma.js?style=flat-square&logo=github&color=%236e7fd2
[icon-ser]:https://img.shields.io/badge/dynamic/json?color=%236e7fd2&label=series&prefix=%27&query=series&suffix=%27&url=https%3A%2F%2Fraw.githubusercontent.com%2F0E9B061F%2Ffantasma.js%2Fmaster%2Fpackage.json&style=flat-square
[icon-lic]:https://img.shields.io/github/license/0E9B061F/fantasma.js.svg?style=flat-square&color=%236e7fd2
[icon-npm]:https://img.shields.io/npm/v/fantasma.js.svg?style=flat-square&logo=npm&color=%23de2657
[icon-mnt]:https://img.shields.io/maintenance/yes/2024.svg?style=flat-square
