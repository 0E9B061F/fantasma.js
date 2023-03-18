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
        const pconf = conf.parent ? conf.parent.conf : {}
        this.conf = {
            parent: null,
            before: null,
            after: null,
            afterLoop: null,
            eachFrame: null,
            loop: 0,
            reverse: false,
            els: {},
            ...pconf,
            ...conf,
        }
        this.parent = conf.parent
        this.before = this.parent ? null : this.conf.before
        this.after = this.parent ? null : this.conf.after
        this.afterLoop = this.parent ? null : this.conf.afterLoop
        this.eachFrame = this.parent ? null : this.conf.eachFrame
        this.animation = animation
        this.loop = this.conf.loop
        this.reverse = conf.reverse
        this.loops = 0
        this.rt = 0
        this.t = 0
        this.start = null
        this.els = this.conf.els
        this.strips = this.animation.strips.map(abs=> {
            return new RealStrip(abs, this.els[abs.obj])
        })
        this.subplayers = []
    }
    set(t) {
        for (let x = 0; x < this.subplayers.length; x++) {
            this.subplayers[x].set(t)
        }
        for (let x = 0; x < this.strips.length; x++) {
            this.strips[x].set(t)
        }
    }
    frame() {
        const elapsed = Date.now() - this.start
        this.rt = this.animation.rawT(elapsed)
        this.t = this.animation.calcT(elapsed)
        this.set(this.t)
        if (this.eachFrame) this.eachFrame(this)
        if (this.t < 1) window.requestAnimationFrame(()=> this.frame())
        else {
            if (this.afterLoop) this.afterLoop(this)
            if (this.loop < 0 || this.loops < this.loop) {
                this.loops++
                this.play()
            } else {
                this.loops = 0
                if (this.after) this.after()
            }
        }
    }
    play() {
        if (this.start === null || this.t >= 1) {
            this.start = Date.now()
            this.t = 0
            if (this.loops == 0 && this.before) this.before()
        }
        window.requestAnimationFrame(()=> this.frame())
    }
    sub(conf) {
        const s = new Playback(this.animation, {
            ...conf,
            parent: this,
        })
        this.subplayers.push(s)
        return s
    }
}


module.exports = { AbstractStrip, RealStrip, Animation, Playback }
