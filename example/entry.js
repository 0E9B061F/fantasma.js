'use strict'

require('./example.scss')

const html = require('waxwing.js')
const { Animation } = require('../lib/animation.js')

class FourSquare {
  constructor(parent, anchor, animation, depth=0, conf={}) {
    this.parent = parent
    this.anchor = anchor
    this.depth = depth
    this.leaf = this.depth == 0
    this.children = []
    this.animation = animation
    this.els = html.start(this.anchor, c => {
      c.div('@bg squares', c => {
        c.div(`@rs red square`, c => this.mkcore(c, "rc"))
        c.div(`@bs blue square`, c => this.mkcore(c, "bc"))
        c.div(`@gs green square`, c => this.mkcore(c, "gc"))
        c.div(`@ys yellow square`, c => this.mkcore(c, "yc"))
      })
    })
    if (this.parent) {
      this.player = this.parent.player.sub({els: this.els})
    } else {
      this.player = this.animation.player({els: this.els, ...conf})
    }
    this.populate()
  }
  addchild(to) {
    this.children.push(new FourSquare(this, this.els[to], this.animation, this.depth-1))
  }
  populate() {
    if (this.depth > 0) {
      this.addchild("rc")
      this.addchild("yc")
      this.addchild("gc")
      this.addchild("bc")
    }
  }
  mkcore(c, name) {
    c.div(`@${name} ${this.leaf ? "leaf" : ""} core`, c=> {
      // if (this.depth == 0) c.div('dot')
    })
  }
  play() {
    this.player.play()
  }
  pause() {
    this.player.pause()
  }
}

const els = html.start(c=> {
  c.div("#example-main", c=> {
    c.div("$controls bar", c => {
      c.h1('$title', c=> c.text('fantasma.js Example'))
      c.div("spacer", c=> {
        c.div("slot", c=> c.div("@pr progress"))
        c.div("slot", c=> c.div("@pt progress"))
        c.div("$loopbar")
      })
      c.div("@replay lock button", c => c.text("PLAY"))
      c.div("@pause lock button", c => c.text("PAUSE"))
      c.div("@smooth toggle button active", c => c.text("SMOOTH"))
    })
    c.div('$viewer smooth')
  })
})

const wide = 81
const thin = 19
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
    easing: "easeOutQuad",
    scale: 2,
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

const loop = 1

let markels = {}
const setmarks =()=> {
  els.loopbar.textContent = ""
  if (loop >= 0) {
    return html.start(els.loopbar, c => {
      for (let x = 0; x <= loop; x++) {
        c.div(`$mark${x} loopmark`)
      }
    })
  } else {
    html.start(els.loopbar, c => {
      c.div(`loopmark forward`)
    })
  }
}

const fs = new FourSquare(null, els.viewer, animation, 3, {
  before: ()=> {
    els.replay.classList.remove("active")
    els.pause.classList.add("active")
    markels = setmarks()
  },
  after: ()=> {
    els.replay.classList.add("active")
    els.pause.classList.remove("active")
  },
  beforePause: ()=> {
    els.replay.classList.add("active")
    els.pause.classList.remove("active")
  },
  afterPause: () => {
    els.replay.classList.remove("active")
    els.pause.classList.add("active")
  },
  afterLoop: p=> {
    if (loop >= 0) {
      for (let x = 0; x <= p.loops; x++) {
        markels[`mark${x}`].classList.add("active")
      }
    } else {
      document.querySelector("#loopbar .loopmark:last-child").classList.add("active")
      html.start(els.loopbar, c => {
        c.div(`loopmark forward`)
      })
    }
  },
  eachFrame: p=> {
    els.pt.style.width = `${100 * p.t}%`
    els.pr.style.width = `${100 * p.rt}%`
  },
  loop,
  reverse: true,
})

els.replay.addEventListener("click", e=> {
  e.preventDefault()
  if (e.target.classList.contains("active")) {
    fs.play()
  }
})
els.pause.addEventListener("click", e=> {
  e.preventDefault()
  fs.pause()
})

els.smooth.addEventListener("click", e=> {
  e.preventDefault()
  els.viewer.classList.toggle("smooth")
  if (els.viewer.classList.contains("smooth")) {
    els.smooth.classList.add("active")
  } else {
    els.smooth.classList.remove("active")
  }
})

fs.play()
