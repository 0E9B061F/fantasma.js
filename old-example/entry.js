'use strict'

require('./test.styl')

const html = require('waxwing.js')

//const mocha = require('mocha')
//const expect = require('chai').expect
const fantasma = require('../lib/fantasma.js')

html.start(c=> {
  c.h1('#title', c=> c.text('fantasma.js Test Apparatus'))
  c.div('squares', c=> {
    c.div('#rs red square',    c=> c.div('core', c=> c.text('R')))
    c.div('#bs blue square',   c=> c.div('core', c=> c.text('B')))
    c.div('#gs green square',  c=> c.div('core', c=> c.text('G')))
    c.div('#ys yellow square', c=> c.div('core', c=> c.text('Y')))
  })
  c.div('#meter', c=> {
    c.div('#ideal')
    c.div('#real')
  })
  c.div('#indicator')
  c.div('#graphs')
})

const mparts = []
const title = document.getElementById('title')
const ideal = document.getElementById('ideal')
const real = document.getElementById('real')
const ind = document.getElementById('indicator')
const graphs = document.getElementById('graphs')
const h = ideal.offsetHeight

title.style.top = `${50 - (title.offsetHeight / 2)}px`

let indicating = false

function mkgraph(names, props, w, h) {
  const graph = html.svg({
    id: names.join('-')+'-'+props.join('-'),
    width: w, height: h,
    viewBox: `0 0 ${w} ${h}`,
    xmlns: 'http://www.w3.org/2000/svg'
  })
  graphs.append(graph)
  return graph
}

function adjust(start, h, t) {
  if (!indicating) return
  const p = Date.now() - start
  let pos = h * (p / t)
  if (pos > 601) pos = 601
  ind.style.top = `${100 + pos}px`
  ind.innerHTML = p < 1000 ? `${p}ms` : `${(p / 1000).toFixed(1)}s`
  if (p > t) {
    mparts.forEach(mp=> mp.resize(p))
  }
  setTimeout(adjust, 10, start, h, t)
}

function indicate(h, t) {
  indicating = true
  adjust(Date.now(), h, t)
}

function stop(d, i) {
  indicating = false
  const s = d - i
  const p = (s / i) * 100
  ind.append(html.div('foo', c=> c.text(`${s>0?'+':''}${s}ms / ${p>0?'+':''}${p.toFixed(1)}%`)))
}

function mark(d, i, t) {
  const l = d / t
  const s = d - i
  const p = html.div('real-part', c=> c.text(`${s>0 ? '+': ''}${s}ms`))
  mparts.push(new RealPart(d, t, h, p))
  real.append(p)
}

const timescale = 0.25
let times = [500, 500, 600, 400, 750, 850]
times = times.map(n=>n*timescale)

const states = new fantasma.StateSet()

const k = fantasma.build({
  rate: 25,
  before: k=> {
    indicate(h, k.length)
    k.start = Date.now()
  },
  after: k=> {
    stop(Date.now() - k.start, k.length)
    console.log(states)
    graph(states, 'width')
    graph(states, 'height')
  },
  beforePart: p=> p.start = Date.now(),
  afterPart: p=> {
    console.log(`${Date.now() - p.start}/${p.length} | ${p.portion}`)
    mark(Date.now() - p.start, p.length, p.fantasma.length)
  },
  getStates: s=> {
    states.append(s)
  }
}, [
  {
    easing: 'easeOutCubic',
    times,
    do: [
      {el: [rs, bs], prop: 'height', path: [100, 300, 300, 100, 100, 300, 100]},
      {el: [gs, ys], prop: 'height', path: [300, 100, 100, 300, 300, 100, 300]},
      {el: rs, prop: 'width', path: [100, 100, 300, 300, 100, 300, 100]},
      {el: bs, prop: 'width', path: [300, 300, 100, 100, 300, 100, 300]},
      {el: gs, prop: 'width', path: [300, 300, 300, 300, 100, 300, 300]},
      {el: ys, prop: 'width', path: [100, 100, 100, 100, 300, 100, 100]},
    ],
  },
  {
    easing: 'easeInCubic',
    times,
    do: [
      {el: [rs, bs], prop: 'height', path: [100, 300, 300, 100, 100, 300, 100]},
      {el: [gs, ys], prop: 'height', path: [300, 100, 100, 300, 300, 100, 300]},
      {el: rs, prop: 'width', path: [100, 100, 300, 300, 100, 300, 100]},
      {el: bs, prop: 'width', path: [300, 300, 100, 100, 300, 100, 300]},
      {el: gs, prop: 'width', path: [300, 300, 300, 300, 100, 300, 300]},
      {el: ys, prop: 'width', path: [100, 100, 100, 100, 300, 100, 100]},
    ],
  },
  {
    easing: 'easeOutQuad',
    times,
    do: [
      {el: [rs, bs], prop: 'height', path: [100, 300, 300, 100, 100, 300, 100]},
      {el: [gs, ys], prop: 'height', path: [300, 100, 100, 300, 300, 100, 300]},
      {el: rs, prop: 'width', path: [100, 100, 300, 300, 100, 300, 100]},
      {el: bs, prop: 'width', path: [300, 300, 100, 100, 300, 100, 300]},
      {el: gs, prop: 'width', path: [300, 300, 300, 300, 100, 300, 300]},
      {el: ys, prop: 'width', path: [100, 100, 100, 100, 300, 100, 100]},
    ],
  },
  {
    easing: 'easeInQuad',
    times,
    do: [
      {el: [rs, bs], prop: 'height', path: [100, 300, 300, 100, 100, 300, 100]},
      {el: [gs, ys], prop: 'height', path: [300, 100, 100, 300, 300, 100, 300]},
      {el: rs, prop: 'width', path: [100, 100, 300, 300, 100, 300, 100]},
      {el: bs, prop: 'width', path: [300, 300, 100, 100, 300, 100, 300]},
      {el: gs, prop: 'width', path: [300, 300, 300, 300, 100, 300, 300]},
      {el: ys, prop: 'width', path: [100, 100, 100, 100, 300, 100, 100]},
    ],
  },
  {
    easing: 'easeOutQuad',
    times: times.slice(0,3),
    do: [
      {el: [rs, bs], prop: 'height', path: [100, 300, 300, 100]},
      {el: [gs, ys], prop: 'height', path: [300, 100, 100, 300]},
      {el: rs, prop: 'width', path: [100, 100, 300, 300]},
      {el: bs, prop: 'width', path: [300, 300, 100, 100]},
      {el: gs, prop: 'width', path: [300, 300, 300, 300]},
      {el: ys, prop: 'width', path: [100, 100, 100, 100]},
    ],
  },
  {
    easing: 'easeInQuad',
    times: times.slice(3),
    do: [
      {el: [rs, bs], prop: 'height', path: [100, 100, 300, 100]},
      {el: [gs, ys], prop: 'height', path: [300, 300, 100, 300]},
      {el: rs, prop: 'width', path: [300, 100, 300, 100]},
      {el: bs, prop: 'width', path: [100, 300, 100, 300]},
      {el: gs, prop: 'width', path: [300, 100, 300, 300]},
      {el: ys, prop: 'width', path: [100, 300, 100, 100]},
    ],
  },
])

function convert(range, val, within) {
  return within * (val / range)
}

function graph(states, prop) {
  const data = {}
  let mint
  let maxt = 0
  let minv
  let maxv = 0
  states.all((name, el, p, time, val)=> {
    if (p == prop) {
      if (!data[name]) data[name] = {}
      data[name][time] = val
      if (mint == undefined || time < mint) mint = time
      if (time > maxt) maxt = time
      if (minv == undefined || val < minv) minv = val
      if (val > maxv) maxv = val
    }
  })
  const rangev = Math.abs(minv - maxv)
  const rangeh = Math.abs(mint - maxt)
  const names = Object.keys(data)
  const graphs = {}
  let name
  let times
  let time
  let x1
  let y1
  let x2
  let y2
  const gw = 250
  const gh = 150
  for (let i = 0; i < names.length; i++) {
    name = names[i]
    graphs[name] = mkgraph([name], [prop], gw, gh)
    graphs[name].append(html.line({x1: 0, y1: gh, x2: gw, y2: gh, stroke: 'black'}))
    graphs[name].append(html.line({x1: 0, y1: gh, x2: 0, y2: 0, stroke: 'black'}))
    times = Object.keys(data[name])
    let last
    for (let n = 0; n < times.length; n++) {
      time = times[n]
      if (last) {
        x1 = convert(rangeh, last.time - mint, gw)
        y1 = convert(rangev, last.val - minv, gh)
        x2 = convert(rangeh, time - mint, gw)
        y2 = convert(rangev, data[name][time] - minv, gh)
        graphs[name].append(html.line({x1, y1, x2, y2, stroke: '#aaa'}))
      }
      last = {time, val: data[name][time]}
    }
  }
}

class RealPart {
  constructor(d, t, h, el) {
    this.d = d
    this.t = t
    this.h = h
    this.el = el
    this.el.style.height = `${this.h * (this.d/this.t)}px`
  }
  resize(t) {
    if (t > this.t) {
      const ih = this.h * (this.d / t)
      this.el.style.height = `${ih}px`
    }
  }
}

class MeterPart {
  constructor(fantasma, part, h, el) {
    this.fantasma = fantasma
    this.part = part
    this.h = h
    this.el = el
    this.el.style.height = `${this.h * this.part.portion}px`
  }
  resize(t) {
    if (t > this.fantasma.length) {
      const ih = this.h * (this.fantasma.length / t)
      this.el.style.height = `${ih * this.part.portion}px`
    }
  }
}

let p
k.sections.forEach(s=> {
  p = html.div('ideal-part', c=> c.text(`${s.index}:${s.anims.length}`))
  mparts.push(new MeterPart(k, s, h, p))
  ideal.append(p)
})

k.animate()
