"use strict"


const { Resolver } = require("./util.js")
const { Path } = require("./path.js")
const EASINGS = require("./easings.js")


class AbstractStrip {
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
        this.obj = conf.obj
        this.prop = Array.isArray(conf.prop) ? conf.prop : [conf.prop]
        conf.path = Array.isArray(conf.path) ? conf.path : [conf.path]
        this.parts = conf.path
        this.path = new Path(0, this.realscale, ...this.parts)
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
}

class RealStrip {
    constructor(abs, obj) {
        this.abs = abs
        this.obj = obj
        this.res = new Resolver(this.obj, ...this.abs.prop)
        this.path = new Path(this.res.initial, this.abs.realscale, ...this.abs.parts)
    }
    set(t) {
        t = this.abs.calcT(t)
        let v = this.path.getPosition(t)
        if (this.abs.unit) v = `${v}${this.abs.unit}`
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
            s = new AbstractStrip(this, s)
            this.totalTime = Math.max(this.totalTime, s.totalTime)
            return s
        })
        for (let x = 0; x < this.strips.length; x++) {
            this.strips[x].init()
        }
    }
    rawT(ms) {
        return Math.min(1, Math.max(0, ms / this.totalTime))
    }
    calcT(ms) {
        return this.easing(this.rawT(ms))
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
            eachFrame: null,
            els: {},
            ...conf,
        }
        this.before = conf.before
        this.after = conf.after
        this.eachFrame = conf.eachFrame
        this.animation = animation
        this.rt = 0
        this.t = 0
        this.start = null
        this.els = conf.els
        this.strips = this.animation.strips.map(abs=> {
            return new RealStrip(abs, this.els[abs.obj])
        })
    }
    set(t) {
        for (let x = 0; x < this.strips.length; x++) {
            this.strips[x].set(t)
        }
    }
    play() {
        if (this.start === null || this.t >= 1) {
            this.start = Date.now()
            this.t = 0
            if (this.before) this.before()
        }
        window.requestAnimationFrame(() => {
            const elapsed = Date.now() - this.start
            this.rt = this.animation.rawT(elapsed)
            this.t = this.animation.calcT(elapsed)
            this.set(this.t)
            if (this.eachFrame) this.eachFrame(this)
            if (this.t < 1) this.play()
            else if (this.after) this.after()
        })
    }
}


module.exports = { AbstractStrip, RealStrip, Animation, Playback }
