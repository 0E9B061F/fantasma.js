'use strict'

require('./example.scss')

const html = require('waxwing.js')
const { Animation } = require('../../lib/animation.js')

const els = html.start(c=> {
  c.div("#example-head", c=> {
    c.a("#title", {href: "https://github.com/0E9B061F/fantasma.js"}, c=> c.text("FANTASMA.JS"))
    c.a("#site", {href: "https://0E9B061F.github.io"}, c=> c.text("0E9B061F.github.io"))
  })
  c.div("#example-main smooth", c=> {
    c.div("$sq1 square")
    c.div("$sq2 square")
    c.div("$sq3 square")
    c.div("$sq4 square")
  })
})

const p1 = [
  { from: 100, to: 600, time: 500 },
  { to: 600, time: 200 },
  { to: 300, time: 300 },
  { to: 300, time: 300 },
  { to: 500, time: 400 },
  { to: 100, time: 300 },
]
const p2 = [
  { from: 50, to: 600, time: 500 },
  { to: 600, time: 200 },
  { to: 300, time: 200 },
  { to: 300, time: 300 },
  { to: 0, time: 400 },
  { to: 50, time: 300 },
]
const p3 = [
  { from: 500, to: 0, time: 500 },
  { to: 0, time: 200 },
  { to: 300, time: 300 },
  { to: 300, time: 300 },
  { to: 450, time: 400 },
  { to: 500, time: 300 },
]
const p4 = [
  { from: 550, to: 0, time: 500 },
  { to: 0, time: 200 },
  { to: 300, time: 200 },
  { to: 300, time: 300 },
  { to: 200, time: 400 },
  { to: 550, time: 300 },
]


const animation = new Animation({
  scale: 3,
  easing: "easeOutQuad",
  strips: [
    { obj: "sq1", prop: ["style", "left"], unit: "px", path: p1},
    { obj: "sq2", prop: ["style", "left"], unit: "px", path: p2},
    { obj: "sq3", prop: ["style", "left"], unit: "px",  path: p3},
    { obj: "sq4", prop: ["style", "left"], unit: "px",  path: p4},
  ],
})

const player = animation.player({els, loop: -1})
player.play()
