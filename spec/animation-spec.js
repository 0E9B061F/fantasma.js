"use strict"


const { Strip, Animation } = require("../lib/animation.js")


describe("Animation", function () {
    let o, a1
    beforeEach(function () {
        o = [
            {
                a: 1,
                b: {
                    a: 2,
                    b: {
                        a: 3,
                    }
                },
                c: 4,
                d: {
                    a: 5,
                    b: {
                        a: 6,
                    }
                }
            }
        ]
        a1 = new Animation({
            easing: "linear",
            strips: [{
                obj: o[0],
                prop: ["b", "b", "a"],
                path: [
                    {to: 6, time: 500},
                    {to: 12, time: 500},
                ],
            }, {
                obj: o[0],
                prop: ["d", "b", "a"],
                start: 500,
                path: [
                    { to: 12, time: 500 },
                    { to: 24, time: 1000 },
                ],
            }],
        })
    })
    it("should create a well formed animation from a series of strips", function () {
        expect(a1.easing).toEqual("linear")
        expect(a1.totalTime).toEqual(2000)
        expect(a1.strips.length).toEqual(2)
        expect(a1.strips[0].start).toEqual(0)
        expect(a1.strips[0].startT).toEqual(0)
        expect(a1.strips[0].endT).toEqual(0.5)
        expect(a1.strips[0].totalTime).toEqual(1000)
        expect(a1.strips[1].start).toEqual(500)
        expect(a1.strips[1].startT).toEqual(0.25)
        expect(a1.strips[1].endT).toEqual(1)
        expect(a1.strips[1].totalTime).toEqual(2000)
    })
    it("should correctly set values", function () {
        a1.set(0)
        expect(o[0].b.b.a).toEqual(3)
        expect(o[0].d.b.a).toEqual(6)
        expect(a1.strips[0].res.val).toEqual(3)
        expect(a1.strips[1].res.val).toEqual(6)
        a1.set(0.25)
        expect(o[0].b.b.a).toEqual(6)
        expect(o[0].d.b.a).toEqual(6)
        expect(a1.strips[0].res.val).toEqual(6)
        expect(a1.strips[1].res.val).toEqual(6)
        a1.set(0.5)
        expect(o[0].b.b.a).toEqual(12)
        expect(o[0].d.b.a).toEqual(12)
        expect(a1.strips[0].res.val).toEqual(12)
        expect(a1.strips[1].res.val).toEqual(12)
        a1.set(0.75)
        expect(o[0].b.b.a).toEqual(12)
        expect(o[0].d.b.a).toEqual(18)
        expect(a1.strips[0].res.val).toEqual(12)
        expect(a1.strips[1].res.val).toEqual(18)
        a1.set(1)
        expect(o[0].b.b.a).toEqual(12)
        expect(o[0].d.b.a).toEqual(24)
        expect(a1.strips[0].res.val).toEqual(12)
        expect(a1.strips[1].res.val).toEqual(24)
    })
})