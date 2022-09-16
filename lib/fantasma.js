'use strict'

/* fantasma.js
 *
 * advanced animation library
 * supports multiple animations in sequence
 * as well as animations in parallel
 *
 * 0E9B061F <0E9B061F@protonmail.com>, 2019
 */


// Easing functions
const EASINGS = require('./easings.js')
// Utility functions
const util = require('./util.js')


// ??? lol
const time = {}
let depth
let parts
Object.keys(EASINGS).forEach(name=> {
  parts = name.replace(/([A-Z])/, '-$1').split('-').map(n=> n.toLowerCase())
  depth = time
  parts.forEach((part, i)=> {
    if (i == name.length-1) {
      depth[part] = EASINGS[name]
    } else if (!depth[part]) {
      depth[part] = {}
      depth = depth[part]
    }
  })
})


// Utilities

function makeSegments(points, times) {
  if (points.length < 2 || times.length != points.length-1) {
    throw new Error('Invalid path.')
  }
  const segments = []
  for (let i = 0; i < points.length; i+=1) {
    if (points[i+1] !== undefined) {
      segments.push(new Segment(points[i], points[i+1], times[i]))
    }
  }
  return segments
}


// Main code

class Segment {
  constructor(from, to, time) {
    this.from = from
    this.to = to
    this.time = time
    this.delta = Math.abs(from - to)
    this.sense = from < to ? 1 : -1
    this.startTime = 0
    this.endTime = time
    this.timeShare = 1
    this.timeStop = 1
    this.prev = null
    this.next = null
  }
  get lastStop() {
    if (this.prev) return this.prev.timeStop
    else return 0
  }
  localTime(t) {
    if (t == 1 && !this.next) return t
    return ((t - this.lastStop) / this.timeShare)
  }
}

class Path {
  constructor(segments) {
    this.segments = segments
    this.totalTime = 0
    for (let i = 0; i < segments.length; i+=1) {
      if (segments[i-1]) segments[i].prev = segments[i-1]
      if (segments[i+1]) segments[i].next = segments[i+1]
      segments[i].startTime = this.totalTime
      this.totalTime += segments[i].time
      segments[i].endTime = this.totalTime
    }
    for (let i = 0; i < segments.length; i+=1) {
      segments[i].timeShare = segments[i].time / this.totalTime
      segments[i].timeStop = segments[i].endTime / this.totalTime
    }
    this.lastIndex = 0
    this.currentIndex = 0
    this.changedIndex = false
  }
  getSegIndex(t) {
    for (let i = 0; i < this.segments.length; i+=1) {
      if (t <= this.segments[i].timeStop) {
        if (i != this.currentIndex) {
          this.lastIndex = this.currentIndex
          this.currentIndex = i
          this.changedIndex = true
        } else if (this.changedIndex) {
          this.changedIndex = false
        }
        return i
      }
    }
  }
  getSegment(t) {
    return this.segments[this.getSegIndex(t)]
  }
  getPosition(t) {
    const seg = this.getSegment(t)
    return seg.from + seg.sense * seg.delta * seg.localTime(t)
  }
}

class Animation {
  constructor(conf) {
    conf = Object.assign({
      time: 0,
      easing: EASINGS.linear,
      each: null,
      after: null,
      time: null,
      times: null,
      start: 0,
      from: null,
      to: null,
      path: null,
      el: null,
      prop: null,
      name: null,
      at: [],
      clear: false
    }, conf)
    this.el = Array.isArray(conf.el) ? conf.el : [conf.el]
    this.prop = conf.prop
    this.clear = conf.clear
    this.name = conf.name || this.getName()
    this.time = conf.time
    this.easing = typeof(conf.easing) == 'string' ? EASINGS[conf.easing] : conf.easing
    this.each = conf.each
    this.after = conf.after
    this.times = conf.times || [conf.time]
    this.points = conf.path || [conf.from, conf.to]
    this.start = conf.start
    this.at = []
    for (let i = 0; i < conf.at.length; i += 1) this.at[conf.at[i].segment] = conf.at[i]
    for (let i = 0; i < this.start; i += 1) this.points.unshift(this.points[0])
    if (this.points.length < this.times.length+1) {
      const less = this.times.length+1 - this.points.length
      for (let i = 0; i < less; i += 1) this.points.push(this.points[this.points.length-1])
    }
    this.path = new Path(makeSegments(this.points, this.times))
    this.total = this.path.totalTime
  }
  get length() {
    return this.times.reduce((l,t)=>l+t, 0)
  }
  get t() {
    return this.easing(this.time / this.total)
  }
  get position() {
    return this.path.getPosition(this.t)
  }
  get done() {
    return this.time >= this.total
  }
  getName() {
    const el = this.el[0]
    if (el.id) {
      return `#${el.id}`
    } else if (el.classList.length) {
      return '.' + el.classList.toString().replace(/ /, '.')
    } else {
      return el.tagName
    }
  }
  advance(ms) {
    if (!this.done && ms > 0) {
      if (this.time + ms > this.total) this.time = this.total
      else this.time += ms
      this.queued = true
    }
  }
  performed() {
    if (this.queued) {
      if (this.path.changedIndex && this.at[this.path.lastIndex]) {
        if (this.at[this.path.lastIndex].after) this.at[this.path.lastIndex].after(this.el)
      }
      if (this.at[this.path.currentIndex] && this.at[this.path.currentIndex].each) {
        this.at[this.path.currentIndex].each(this.el)
      }
      if (this.each) this.each(this.el)
      if (this.done) {
        if (this.at[this.path.currentIndex] && this.at[this.path.currentIndex].after) {
          this.at[this.path.currentIndex].after(this.el)
        }
        if (this.after) this.after(this.el)
        if (this.clear) {
          for (let i = 0; i < this.el.length; i += 1) {
            this.el[i].style[this.prop] = null
          }
        }
      }
      this.queued = false
    }
  }
  state(t) {
    const set = new StateSet()
    for (let i = 0; i < this.el.length; i += 1) {
      set.add(new State(this.el[i], this.prop, this.position, t))
    }
    return set
  }
  reset(t=0) {
    this.time = t
  }

}

class StateSet {
  constructor() {
    this.states = {}
    this.elements = {}
    this.props = {}
    this.lastvals = {}
  }
  addState(el, name, prop, time, val) {
    if (!this.states[name]) {
      this.states[name] = {}
      this.elements[name] = el
    }
    if (!this.lastvals[name]) this.lastvals[name] = {}
    if (!this.states[name][prop]) this.states[name][prop] = {}
    this.states[name][prop][time] = val
    this.lastvals[name][prop] = val
    this.addProp(prop, name, time, val)
  }
  addProp(prop, name, time, val) {
    if (!this.props[prop]) this.props[prop] = {}
    if (!this.props[prop][name]) this.props[prop][name] = {}
    this.props[prop][name][time] = val
  }
  last(block) {
    const names = Object.keys(this.lastvals)
    let name
    let props
    let prop
    for (let i = 0; i < names.length; i += 1) {
      name = names[i]
      props = Object.keys(this.lastvals[name])
      for (let n = 0; n < props.length; n += 1) {
        prop = props[n]
        block(this.elements[name], prop, this.lastvals[name][prop])
      }
    }
  }
  all(block) {
    const names = Object.keys(this.states)
    let name
    let props
    let prop
    let times
    let time
    for (let i = 0; i < names.length; i += 1) {
      name = names[i]
      props = Object.keys(this.states[name])
      for (let n = 0; n < props.length; n += 1) {
        prop = props[n]
        times = Object.keys(this.states[name][prop])
        for (let j = 0; j < times.length; j += 1) {
          time = times[j]
          block(name, this.elements[name], prop, time, this.states[name][prop][time])
        }
      }
    }
  }
  add(...states) {
    let s
    let name
    for (let i = 0; i < states.length; i += 1) {
      s = states[i]
      name = ''
      if (s.el.id) name += `#${s.el.id}`
      for (let n = 0; n < s.el.classList.length; n += 1) {
        name += `.${s.el.classList[n]}`
      }
      this.addState(s.el, name, s.prop, s.t, s.val)
    }
  }
  append(set) {
    set.all((name, el, prop, time, val)=> {
      this.addState(el, name, prop, time, val)
    })
  }
}
class State {
  constructor(el, prop, val, t) {
    this.el = el
    this.prop = prop
    this.val = val
    this.t = t
  }
}

class Section {
  constructor(fantasma, index, anims, before, after, getStates) {
    this.fantasma = fantasma
    this.index = index
    this.anims = anims
    this.before = before
    this.after = after
    this.getStates = getStates
  }
  get length() {
    return this.anims.reduce((m,a)=>a.length > m ? a.length : m, 0)
  }
  get portion() {
    return this.length / this.fantasma.length
  }
  perform(start, delta, states, after) {
    states.last((el, prop, val)=> {
      el.style[prop] = val + 'px'
    })
    if (this.getStates) this.getStates(states)
    if (after) after()
  }
  continue(last, remaining, after) {
    window.requestAnimationFrame(()=> {
      const start = Date.now()
      const delta = start - last
      let anim
      let states = new StateSet()
      for (let i = 0; i < this.anims.length; i+=1) {
        anim = this.anims[i]
        if (!anim.done) {
          anim.advance(delta)
          states.append(anim.state(start))
          if (anim.done) remaining -= 1
        }
      }
      this.perform(start, delta, states, ()=> {
        for (let i = 0; i < this.anims.length; i+=1) {
          this.anims[i].performed()
        }
      })
      if (remaining) {
        this.continue(start, remaining, after)
      } else {
        if (after) after(this)
        if (this.after) this.after(this)
      }
    })
  }
  animate(before, after) {
    if (before) before(this)
    if (this.before) this.before(this)
    this.continue(Date.now(), this.anims.length, after)
  }
}

class Fantasma {
  constructor(conf, parts) {
    conf = Object.assign({
      before: false,
      after: false,
      beforePart: false,
      afterPart: false,
      getStates: false,
    }, conf)
    this.before = conf.before
    this.after = conf.after
    this.beforePart = conf.beforePart
    this.afterPart = conf.afterPart
    this.getStates = conf.getStates
    this.sections = []
    parts.forEach(anims=> {
      if (!Array.isArray(anims)) anims = [anims]
      anims = util.flat(anims.map(anim=> {
          if (anim.do) {
            const dos = anim.do
            delete anim.do
            return dos.map(a=> new Animation(Object.assign(a, anim)))
          } else {
            return new Animation(anim)
          }
      }))
      this.sections.push(new Section(this, this.sections.length+1, anims, this.beforePart, this.afterPart, this.getStates))
    })
  }
  get length() {
    return this.sections.reduce((l,s)=>l+s.length, 0)
  }
  continue(n) {
    this.sections[n].animate(null, s=> {
      n+=1
      if (n < this.sections.length) this.continue(n)
      else if (this.after) this.after(this)
    })
  }
  animate() {
    if (this.before) this.before(this)
    this.continue(0)
  }
}


module.exports = {
  time, ease: time.ease,
  Path, Segment,
  Fantasma, Section, StateSet,
  build: (...args)=> new Fantasma(...args)
}
