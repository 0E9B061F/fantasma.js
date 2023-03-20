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
        const s = this.animation.calcT(this.start)
        const e = this.animation.calcT(this.totalTime)
        this.startT = s[1]
        this.endT = e[1]
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
    calcT(ms) {
        const rt = Math.min(1, Math.max(0, ms / this.totalTime))
        const et = this.easing(rt)
        return [rt, et]
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
            beforePause: null,
            afterPause: null,
            afterLoop: null,
            eachFrame: null,
            loop: 0,
            reverse: false,
            bounce: false,
            els: {},
            ...pconf,
            ...conf,
        }
        this.parent = this.conf.parent
        this.before = this.parent ? null : this.conf.before
        this.after = this.parent ? null : this.conf.after
        this.beforePause = this.parent ? null : this.conf.beforePause
        this.afterPause = this.parent ? null : this.conf.afterPause
        this.afterLoop = this.parent ? null : this.conf.afterLoop
        this.eachFrame = this.parent ? null : this.conf.eachFrame
        this.animation = animation
        this.loop = this.conf.loop
        this.reverse = this.conf.reverse
        this.bounce = this.conf.bounce
        this.loops = 0
        this.rt = 0
        this.t = 0
        this.paused = false
        this.elapsed = null
        this.lastf = null
        this.els = this.conf.els
        this.strips = this.animation.strips.map(abs=> {
            return new RealStrip(abs, this.els[abs.obj])
        })
        this.subplayers = []
    }
    get bounceverse() { return this.bounce ? !!(this.loops % 2) : false }
    get realverse() {
        return this.bounceverse != this.reverse
    }
    get beginT() { return this.realverse ? 1 : 0 }
    get endT() { return this.realverse ? 0 : 1 }
    get beginMs() { return this.realverse ? this.animation.totalTime : 0 }
    get endMs() { return this.realverse ? 0 : this.animation.totalTime }
    get direction() { return this.realverse ? -1 : 1 }
    get firstLoop() { return this.loops == 0 }
    get ended() {
        if (this.realverse) return this.rt <= 0
        else return this.rt >= 1
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
        if (this.paused) return
        const curf = Date.now()
        const delta = curf - this.lastf
        this.elapsed += (delta * this.direction);
        [this.rt,this.t] = this.animation.calcT(this.elapsed)
        this.set(this.t)
        this.lastf = curf
        if (this.eachFrame) this.eachFrame(this)
        if (!this.ended) window.requestAnimationFrame(()=> this.frame())
        else {
            if (this.afterLoop) this.afterLoop(this)
            if (this.loop < 0 || this.loops < this.loop) {
                this.loops++
                this.play()
            } else {
                if (this.after) this.after()
                this.loops = 0
                this.elapsed = null
                this.lastf = null
            }
        }
    }
    pause() {
        if (this.lastf && !this.ended) {
            this.paused = Date.now()
            if (this.beforePause) this.beforePause()
        }
    }
    play() {
        if (this.paused) {
            this.lastf += (Date.now() - this.paused)
            this.paused = false
            if (this.afterPause) this.afterPause()
        }
        if (this.elapsed === null || this.ended) {
            this.elapsed = this.beginMs
            if (this.firstLoop && this.before) this.before()
            this.lastf = Date.now()
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
