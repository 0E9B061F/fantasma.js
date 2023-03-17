'use strict'

require('./example.scss')

const html = require('waxwing.js')
const { Animation } = require('../lib/animation.js')

const els = html.start(c=> {
  c.h1('#title', c=> c.text('fantasma.js Test Apparatus'))
  c.div('squares', {anchor: "background"}, c=> {
    c.div('#rs red square', { anchor: "rs" }, c=> c.div('core', c=> c.text('R')))
    c.div('#bs blue square', { anchor: "bs" }, c=> c.div('core', c=> c.text('Y')))
    c.div('#gs green square', { anchor: "gs" }, c=> c.div('core', c=> c.text('G')))
    c.div('#ys yellow square', { anchor: "ys" }, c=> c.div('core', c=> c.text('B')))
  })
  c.div("bar", c=> {
    c.a("#replay button", {anchor: "replay", href: ""}, c=> c.text("REPLAY"))
    c.a("#smooth button", {anchor: "smooth", href: ""}, c=> c.text("REVEAL"))
    c.div("spacer")
    c.span("length info", {anchor: "length"})
  })
})

const wide = 75
const thin = 25
const cent = 50

const p1 = [
  { from: thin, to: wide, time: 500 },
  { to: wide, time: 500 },
  { to: thin, time: 600 },
  { to: thin, time: 400 },
  { to: wide, time: 750 },
  { to: thin, time: 850 },
  { to: cent, time: 500 },
]
const p2 = [
  { from: wide, to: thin, time: 500 },
  { to: thin, time: 500 },
  { to: wide, time: 600 },
  { to: wide, time: 400 },
  { to: thin, time: 750 },
  { to: wide, time: 850 },
  { to: cent, time: 500 },
]

const animation = new Animation({
    easing: "easeOutCubic",
    scale: 3,
  // {
  //   prop: ["style"],
  //   unit: px,
  //   path: [
  //     { time: 500 }, { time: 500 }, { time: 600 },
  //     { time: 400 }, { time: 750 }, { time: 850 },
  //   ],
  //   do: [
  //     { obj: ["rs", "bs"], prop: ["height"], path: p1 },
  //     { obj: ["gs", "ys"], prop: ["height"], path: p2 },
  //     { obj: "rs", prop: ["width"], path: [
  //       { from: thin, to: thin }, { to: wide }, { to: wide }, { to: thin }, { to: wide }, { to: thin },
  //     ]},
  //   ],
  // },
  strips: [
    {
      obj: "rs", prop: ["style", "height"], unit: "%", easing: "easeInQuad", path: [
        ...p1,
        { to: wide, time: 500 },
        { to: thin, time: 700 },
        { to: thin, time: 700 },
        { to: thin, time: 500 },
        { to: wide, time: 500 },
        { to: wide, time: 500 },
        { to: thin, time: 500 },
      ]
    }, {
      obj: "bs", prop: ["style", "height"], unit: "%", easing: "easeInQuad", path: [
        ...p1,
        { to: thin, time: 500 },
        { to: wide, time: 700 },
        { to: thin, time: 700 },
        { to: thin, time: 500 },
        { to: wide, time: 500 },
        { to: wide, time: 500 },
        { to: thin, time: 500 },
      ]
    }, {
      obj: "gs", prop: ["style", "height"], unit: "%", easing: "easeInQuad", path: [
        ...p2,
        { to: thin, time: 500 },
        { to: wide, time: 700 },
        { to: wide, time: 700 },
        { to: wide, time: 500 },
        { to: thin, time: 500 },
        { to: thin, time: 500 },
        { to: wide, time: 500 },
      ]
    }, {
      obj: "ys", prop: ["style", "height"], unit: "%", easing: "easeInQuad", path: [
        ...p2,
        { to: wide, time: 500 },
        { to: thin, time: 700 },
        { to: wide, time: 700 },
        { to: wide, time: 500 },
        { to: thin, time: 500 },
        { to: thin, time: 500 },
        { to: wide, time: 500 },
      ]
    }, {
      obj: "rs", prop: ["style", "width"], unit: "%", easing: "easeInQuad", path: [
        { from: thin, to: thin, time: 500 },
        { to: wide, time: 500 },
        { to: wide, time: 600 },
        { to: thin, time: 400 },
        { to: wide, time: 750 },
        { to: thin, time: 850 },
        { to: cent, time: 500 },
        { to: wide, time: 500 },
        { to: thin, time: 700 },
        { to: thin, time: 700 },
        { to: wide, time: 500 },
        { to: wide, time: 500 },
        { to: thin, time: 500 },
        { to: thin, time: 500 },
        { to: thin, time: 500 },
      ]
    }, {
      obj: "bs", prop: ["style", "width"], unit: "%", easing: "easeInQuad", path: [
        { from: wide, to: wide, time: 500 },
        { to: thin, time: 500 },
        { to: thin, time: 600 },
        { to: wide, time: 400 },
        { to: thin, time: 750 },
        { to: wide, time: 850 },
        { to: cent, time: 500 },
        { to: thin, time: 500 },
        { to: wide, time: 700 },
        { to: wide, time: 700 },
        { to: thin, time: 500 },
        { to: thin, time: 500 },
        { to: wide, time: 500 },
        { to: wide, time: 500 },
        { to: wide, time: 500 },
      ]
    }, {
      obj: "gs", prop: ["style", "width"], unit: "%", easing: "easeInQuad", path: [
        { from: wide, to: wide, time: 500 },
        { to: wide, time: 500 },
        { to: wide, time: 600 },
        { to: thin, time: 400 },
        { to: wide, time: 750 },
        { to: wide, time: 850 },
        { to: cent, time: 500 },
        { to: wide, time: 500 },
        { to: thin, time: 700 },
        { to: thin, time: 700 },
        { to: wide, time: 500 },
        { to: wide, time: 500 },
        { to: thin, time: 500 },
        { to: thin, time: 500 },
        { to: wide, time: 500 },
      ]
    }, {
      obj: "ys", prop: ["style", "width"], unit: "%", easing: "easeInQuad", path: [
        { from: thin, to: thin, time: 500 },
        { to: thin, time: 500 },
        { to: thin, time: 600 },
        { to: wide, time: 400 },
        { to: thin, time: 750 },
        { to: thin, time: 850 },
        { to: cent, time: 500 },
        { to: thin, time: 500 },
        { to: wide, time: 700 },
        { to: wide, time: 700 },
        { to: thin, time: 500 },
        { to: thin, time: 500 },
        { to: wide, time: 500 },
        { to: wide, time: 500 },
        { to: thin, time: 500 },
      ]
    },
  ],

})

console.log(animation)
console.log(els.rs)

const player = animation.player({els})

els.replay.addEventListener("click", e => {
  e.preventDefault()
  player.play()
})

els.smooth.addEventListener("click", e => {
  e.preventDefault()
  els.background.classList.toggle("smooth")
  if (els.background.classList.contains("smooth")) {
    els.smooth.textContent = "SMOOTH"
  }
  else els.smooth.textContent = "REVEAL"
})

player.play()
