"use strict"


const { Resolver } = require("./util.js")
const { Path } = require("./path.js")
const EASINGS = require("./easings.js")


class Strip {
    constructor(animation, conf) {
        conf = {
            start: 0,
            easing: "linear",
            unit: null,
            scale: 1,
            ...conf
        }
        this.animation = animation
        this.unit = conf.unit
        this.easing = EASINGS[conf.easing]
        this.scale = conf.scale
        this.realscale = this.animation.scale * this.scale
        this.start = conf.start * this.realscale
        conf.prop = Array.isArray(conf.prop) ? conf.prop : [conf.prop]
        this.res = new Resolver(conf.obj, ...conf.prop)
        conf.path = Array.isArray(conf.path) ? conf.path : [conf.path]
        this.path = new Path(this.res.initial, this.realscale, ...conf.path)
        this.totalTime = this.start + this.path.totalTime
    }
    init() {
        this.startT = this.animation.calcT(this.start)
        this.endT = this.animation.calcT(this.totalTime)
        this.deltaT = this.endT - this.startT
    }
    calcT(t) {
        t = (t - this.startT) / this.deltaT
        t = Math.min(1, Math.max(0, t))
        return this.easing(t)
    }
    set(t) {
        t = this.calcT(t)
        let v = this.path.getPosition(t)
        if (this.unit) v = `${v}${this.unit}`
        this.res.val = v
    }
}

class Animation {
    constructor(conf) {
        conf = {
            easing: "linear",
            strips: [],
            scale: 1,
            ...conf,
        }
        this.easing = EASINGS[conf.easing]
        this.scale = conf.scale
        this.totalTime = 0
        this.strips = conf.strips.map(s=> {
            s = new Strip(this, s)
            this.totalTime = Math.max(this.totalTime, s.totalTime)
            return s
        })
        for (let x = 0; x < this.strips.length; x++) {
            this.strips[x].init()
        }
    }
    calcT(ms) {
        let t = Math.min(1, Math.max(0, ms / this.totalTime))
        t = this.easing(t)
        return t
    }
    set(t) {
        for (let x = 0; x < this.strips.length; x++) {
            this.strips[x].set(t)
        }
    }
    player(conf={}) {
        return new Playback(this, conf)
    }
}

class Playback {
    constructor(animation, conf) {
        conf = {
            before: null,
            after: null,
            ...conf,
        }
        this.before = conf.before
        this.after = conf.after
        this.animation = animation
        this.t = 0
        this.start = null
    }
    play() {
        if (this.start === null || this.t >= 1) {
            this.start = Date.now()
            this.t = 0
            if (this.before) this.before()
        }
        window.requestAnimationFrame(() => {
            const elapsed = Date.now() - this.start
            this.t = this.animation.calcT(elapsed)
            this.animation.set(this.t)
            if (this.t < 1) this.play()
            else if (this.after) this.after()
        })
    }
}


module.exports = { Strip, Animation, Playback }
