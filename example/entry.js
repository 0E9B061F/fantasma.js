'use strict'

require('./example.scss')

const html = require('waxwing.js')
const { Animation } = require('../lib/animation.js')

const els = html.start(c=> {
  c.h1('#title', c=> c.text('fantasma.js Test Apparatus'))
  c.div('squares', c=> {
    c.div('#rs red square', { anchor: "rs" }, c=> c.div('core', c=> c.text('R')))
    c.div('#bs blue square', { anchor: "bs" }, c=> c.div('core', c=> c.text('Y')))
    c.div('#gs green square', { anchor: "gs" }, c=> c.div('core', c=> c.text('G')))
    c.div('#ys yellow square', { anchor: "ys" }, c=> c.div('core', c=> c.text('B')))
  })
  c.div("bar", c=> {
    c.a("#replay button", {anchor: "replay", href: ""}, c=> c.text("REPLAY"))
    c.div("spacer")
    c.span("length info", {anchor: "length"})
  })
})

const p1 = [
  { from: 100, to: 300, time: 500 },
  { to: 300, time: 500 },
  { to: 100, time: 600 },
  { to: 100, time: 400 },
  { to: 300, time: 750 },
  { to: 100, time: 850 },
  { to: 200, time: 500 },
]
const p2 = [
  { from: 300, to: 100, time: 500 },
  { to: 100, time: 500 },
  { to: 300, time: 600 },
  { to: 300, time: 400 },
  { to: 100, time: 750 },
  { to: 300, time: 850 },
  { to: 200, time: 500 },
]

const animation = new Animation({
    easing: "easeOutCubic",
    scale: 2,
  // {
  //   prop: ["style"],
  //   unit: px,
  //   path: [
  //     { time: 500 }, { time: 500 }, { time: 600 },
  //     { time: 400 }, { time: 750 }, { time: 850 },
  //   ],
  //   do: [
  //     { obj: [els.rs, els.bs], prop: ["height"], path: p1 },
  //     { obj: [els.gs, els.ys], prop: ["height"], path: p2 },
  //     { obj: els.rs, prop: ["width"], path: [
  //       { from: 100, to: 100 }, { to: 300 }, { to: 300 }, { to: 100 }, { to: 300 }, { to: 100 },
  //     ]},
  //   ],
  // },
  strips: [
    {
      obj: els.rs, prop: ["style", "height"], unit: "px", easing: "easeInQuad", path: [
        ...p1,
        { to: 300, time: 500 },
        { to: 100, time: 700 },
        { to: 100, time: 700 },
        { to: 100, time: 500 },
        { to: 300, time: 500 },
        { to: 300, time: 500 },
        { to: 100, time: 500 },
      ]
    }, {
      obj: els.bs, prop: ["style", "height"], unit: "px", easing: "easeInQuad", path: [
        ...p1,
        { to: 100, time: 500 },
        { to: 300, time: 700 },
        { to: 100, time: 700 },
        { to: 100, time: 500 },
        { to: 300, time: 500 },
        { to: 300, time: 500 },
        { to: 100, time: 500 },
      ]
    }, {
      obj: els.gs, prop: ["style", "height"], unit: "px", easing: "easeInQuad", path: [
        ...p2,
        { to: 100, time: 500 },
        { to: 300, time: 700 },
        { to: 300, time: 700 },
        { to: 300, time: 500 },
        { to: 100, time: 500 },
        { to: 100, time: 500 },
        { to: 300, time: 500 },
      ]
    }, {
      obj: els.ys, prop: ["style", "height"], unit: "px", easing: "easeInQuad", path: [
        ...p2,
        { to: 300, time: 500 },
        { to: 100, time: 700 },
        { to: 300, time: 700 },
        { to: 300, time: 500 },
        { to: 100, time: 500 },
        { to: 100, time: 500 },
        { to: 300, time: 500 },
      ]
    }, {
      obj: els.rs, prop: ["style", "width"], unit: "px", easing: "easeInQuad", path: [
        { from: 100, to: 100, time: 500 },
        { to: 300, time: 500 },
        { to: 300, time: 600 },
        { to: 100, time: 400 },
        { to: 300, time: 750 },
        { to: 100, time: 850 },
        { to: 200, time: 500 },
        { to: 300, time: 500 },
        { to: 100, time: 700 },
        { to: 100, time: 700 },
        { to: 300, time: 500 },
        { to: 300, time: 500 },
        { to: 100, time: 500 },
        { to: 100, time: 500 },
        { to: 100, time: 500 },
      ]
    }, {
      obj: els.bs, prop: ["style", "width"], unit: "px", easing: "easeInQuad", path: [
        { from: 300, to: 300, time: 500 },
        { to: 100, time: 500 },
        { to: 100, time: 600 },
        { to: 300, time: 400 },
        { to: 100, time: 750 },
        { to: 300, time: 850 },
        { to: 200, time: 500 },
        { to: 100, time: 500 },
        { to: 300, time: 700 },
        { to: 300, time: 700 },
        { to: 100, time: 500 },
        { to: 100, time: 500 },
        { to: 300, time: 500 },
        { to: 300, time: 500 },
        { to: 300, time: 500 },
      ]
    }, {
      obj: els.gs, prop: ["style", "width"], unit: "px", easing: "easeInQuad", path: [
        { from: 300, to: 300, time: 500 },
        { to: 300, time: 500 },
        { to: 300, time: 600 },
        { to: 100, time: 400 },
        { to: 300, time: 750 },
        { to: 300, time: 850 },
        { to: 200, time: 500 },
        { to: 300, time: 500 },
        { to: 100, time: 700 },
        { to: 100, time: 700 },
        { to: 300, time: 500 },
        { to: 300, time: 500 },
        { to: 100, time: 500 },
        { to: 100, time: 500 },
        { to: 300, time: 500 },
      ]
    }, {
      obj: els.ys, prop: ["style", "width"], unit: "px", easing: "easeInQuad", path: [
        { from: 100, to: 100, time: 500 },
        { to: 100, time: 500 },
        { to: 100, time: 600 },
        { to: 300, time: 400 },
        { to: 100, time: 750 },
        { to: 100, time: 850 },
        { to: 200, time: 500 },
        { to: 100, time: 500 },
        { to: 300, time: 700 },
        { to: 300, time: 700 },
        { to: 100, time: 500 },
        { to: 100, time: 500 },
        { to: 300, time: 500 },
        { to: 300, time: 500 },
        { to: 100, time: 500 },
      ]
    },
  ],

})

console.log(animation)
console.log(els.rs)

const player = animation.player()
player.play()

els.replay.addEventListener("click", e => {
  e.preventDefault()
  player.play()
})
