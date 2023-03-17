"use strict"


const { Path, Segment } = require("../lib/path.js")


describe("Segment", function() {
    let s1a, s1b
    beforeEach(function() {
        s1a = new Segment({from: 0, to: 50, time: 500})
        s1b = new Segment({to: 150, time: 600, prev: s1a})
    })
    it("should create a well-formed segment from a segment definition", function() {
        expect(s1a.from).toEqual(0)
        expect(s1a.to).toEqual(50)
        expect(s1a.delta).toEqual(50)
        expect(s1a.time).toEqual(500)
        expect(s1a.sense).toEqual(1)
        expect(s1a.startTime).toEqual(0)
        expect(s1a.endTime).toEqual(500)
        expect(s1a.easing).toEqual("linear")
        expect(s1a.prev).toEqual(null)

        expect(s1b.from).toEqual(50)
        expect(s1b.to).toEqual(150)
        expect(s1b.delta).toEqual(100)
        expect(s1b.time).toEqual(600)
        expect(s1b.sense).toEqual(1)
        expect(s1b.startTime).toEqual(500)
        expect(s1b.endTime).toEqual(1100)
        expect(s1b.easing).toEqual("linear")
        expect(s1b.prev).toEqual(s1a)
    })
    it("should optionally take a speed instead of a time", function() {
        const s1c = new Segment({to: 25, speed: 25, prev: s1b})

        expect(s1c.from).toEqual(150)
        expect(s1c.to).toEqual(25)
        expect(s1c.delta).toEqual(125)
        expect(s1c.time).toEqual(5000)
        expect(s1c.sense).toEqual(-1)
        expect(s1c.startTime).toEqual(1100)
        expect(s1c.endTime).toEqual(6100)
        expect(s1c.easing).toEqual("linear")
        expect(s1c.prev).toEqual(s1b)
    })
})

describe("Path", function() {
    let p1, p2
    beforeEach(function() {
        p1 = new Path(0, 1,
            { from: 80, to: 160, time: 500 },
            { to: 360, time: 500 },
            { to: 0, time: 1000 },
        )
        p2 = new Path(80, 2,
            { to: 160, time: 500 },
            { to: 360, time: 500 },
            { to: 0, time: 1000 },
        )
    })
    it("should construct a path from a series of segment definitions", function() {
        expect(p1.segments.length).toEqual(3)
        expect(p1.totalTime).toEqual(2000)
        expect(p1.scale).toEqual(1)
        expect(p1.startval).toEqual(0)
        expect(p2.segments.length).toEqual(3)
        expect(p2.totalTime).toEqual(4000)
        expect(p2.scale).toEqual(2)
        expect(p2.startval).toEqual(80)
    })
    it("should get a segment for a t value", function() {
        expect(p1.getSegment(0.2)).toEqual(p1.segments[0])
        expect(p1.getSegment(0.3)).toEqual(p1.segments[1])
        expect(p1.getSegment(0.6)).toEqual(p1.segments[2])
        expect(p2.getSegment(0.2)).toEqual(p2.segments[0])
        expect(p2.getSegment(0.3)).toEqual(p2.segments[1])
        expect(p2.getSegment(0.6)).toEqual(p2.segments[2])
    })
    it("should get a position for a t value", function() {
        expect(p1.getPosition(0)).toEqual(80)
        expect(p1.getPosition(0.125)).toEqual(120)
        expect(p1.getPosition(0.25)).toEqual(160)
        expect(p1.getPosition(0.375)).toEqual(260)
        expect(p1.getPosition(0.5)).toEqual(360)
        expect(p1.getPosition(0.625)).toEqual(270)
        expect(p1.getPosition(0.75)).toEqual(180)
        expect(p1.getPosition(0.875)).toEqual(90)
        expect(p1.getPosition(1)).toEqual(0)

        expect(p2.getPosition(0)).toEqual(80)
        expect(p2.getPosition(0.125)).toEqual(120)
        expect(p2.getPosition(0.25)).toEqual(160)
        expect(p2.getPosition(0.375)).toEqual(260)
        expect(p2.getPosition(0.5)).toEqual(360)
        expect(p2.getPosition(0.625)).toEqual(270)
        expect(p2.getPosition(0.75)).toEqual(180)
        expect(p2.getPosition(0.875)).toEqual(90)
        expect(p2.getPosition(1)).toEqual(0)
    })
})