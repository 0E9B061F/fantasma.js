"use strict"


const { Resolver } = require("./util.js")
const { Path } = require("./path.js")


class Strip {
    constructor(animation, conf) {
        conf = {
            start: 0,
            easing: "linear",
            ...conf
        }
        this.animation = animation
        this.start = conf.start
        conf.prop = Array.isArray(conf.prop) ? conf.prop : [conf.prop]
        this.res = new Resolver(conf.obj, ...conf.prop)
        conf.path = Array.isArray(conf.path) ? conf.path : [conf.path]
        this.path = new Path(this.res.initial, conf.easing, ...conf.path)
        this.totalTime = this.start + this.path.totalTime
    }
    init() {
        this.startT = this.animation.calcT(this.start)
        this.endT = this.animation.calcT(this.totalTime)
        this.deltaT = this.endT - this.startT
    }
    calcT(t) {
        t = (t - this.startT) / this.deltaT
        return Math.min(1, Math.max(0, t))
    }
    set(t) {
        t = this.calcT(t)
        this.res.val = this.path.getPosition(t)
    }
}

class Animation {
    constructor(...strips) {
        this.totalTime = 0
        this.strips = strips.map(s=> {
            s = new Strip(this, s)
            this.totalTime = Math.max(this.totalTime, s.totalTime)
            return s
        })
        for (let x = 0; x < this.strips.length; x++) {
            this.strips[x].init()
        }
    }
    calcT(ms) {
        return Math.min(1, Math.max(0, ms / this.totalTime))
    }
    set(t) {
        for (let x = 0; x < this.strips.length; x++) {
            this.strips[x].set(t)
        }
    }
    player() {
        return new Playback(this)
    }
}

class Playback {
    constructor(animation) {
        this.animation = animation
        this.t = 0
        this.start = null
    }
    play() {
        if (this.start === null || this.t >= 1) {
            this.start = Date.now()
            this.t = 0
        }
        window.requestAnimationFrame(() => {
            const elapsed = Date.now() - this.start
            this.t = this.animation.calcT(elapsed)
            this.animation.set(this.t)
            if (this.t < 1) this.play()
        })
    }
}


module.exports = { Strip, Animation, Playback }
