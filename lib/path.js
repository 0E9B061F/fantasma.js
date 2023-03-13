"use strict"


/*
Fantasma.build({
    obj: foo,
    prop: ["x", "y"],
    easing: "yada",
    path: [
        {to: 50, time: 500, easing: "xxx"},
        {to: 150, speed: 25, easing: "yyy"},
    ],
}, {
    obj: foo,
    prop: ["z"],
    easing: "yada",
    start: 250,
    path: [
        {to: 50, time: 500, easing: "xxx"},
        {to: 150, speed: 25, easing: "yyy"},
    ],
})
*/


class Segment {
    constructor(conf) {
        conf = {
            from: null,
            speed: null,
            startval: null,
            easing: "linear",
            ...conf
        }
        if (conf.from !== null) this.from = conf.from
        else if (conf.prev) this.from = conf.prev.to
        else if (conf.startval !== null) this.from = conf.startval
        else {
            throw new Error("initial segment has no initial value")
        }
        this.to = conf.to
        this.delta = Math.abs(this.from - this.to)
        if (conf.speed) {
            conf.time = (this.delta / conf.speed) * 1000
        }
        this.time = conf.time
        this.sense = this.from < this.to ? 1 : -1
        this.startTime = conf.prev ? conf.prev.endTime : 0
        this.endTime = this.startTime + conf.time
        this.easing = conf.easing
        this.timeShare = 1
        this.timeStop = 1
        this.prev = conf.prev || null
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
    constructor(startval, easing, ...segments) {
        this.startval = startval
        this.easing = easing
        this.segments = []
        let prev, cur
        for (let i = 0; i < segments.length; i += 1) {
            prev = this.segments[i - 1]
            cur = new Segment({
                ...segments[i],
                prev: prev,
                startval: this.startval,
            })
            if (prev) prev.next = cur
            this.segments[i] = cur
        }
        this.totalTime = this.segments[this.segments.length-1].endTime
        for (let i = 0; i < this.segments.length; i += 1) {
            this.segments[i].timeShare = this.segments[i].time / this.totalTime
            this.segments[i].timeStop = this.segments[i].endTime / this.totalTime
        }
        this.lastIndex = 0
        this.currentIndex = 0
        this.changedIndex = false
    }
    getSegIndex(t) {
        for (let i = 0; i < this.segments.length; i += 1) {
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


module.exports = { Path, Segment }
