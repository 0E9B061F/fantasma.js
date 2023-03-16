describe("Fantasma", function() {
    var o, a1, a2, a3
    beforeEach(function() {
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
        a1 = new Fantasma({
            easing: "linear",
            strips: [{
                obj: o[0],
                prop: ["b", "b", "a"],
                path: [
                    { to: 6, time: 500 },
                    { to: 12, time: 500 },
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
        a2 = new Fantasma({
            easing: "linear",
            scale: 2,
            strips: [{
                obj: o[0],
                prop: ["b", "b", "a"],
                path: [
                    { to: 6, time: 500 },
                    { to: 12, time: 500 },
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
        a3 = new Fantasma({
            easing: "linear",
            scale: 0.5,
            strips: [{
                obj: o[0],
                prop: ["b", "b", "a"],
                path: [
                    { to: 6, time: 500 },
                    { to: 12, time: 500 },
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
    it("should animate things", function(done) {
        var s, e, d, r
        a1.player({before: ()=> {
            s = Date.now()
            expect(o[0].b.b.a).toEqual(3)
            expect(o[0].d.b.a).toEqual(6)
        }, after: ()=> {
            e = Date.now()
            d = e - s
            r = d / 2000
            expect(r).toBeCloseTo(1, 1)
            expect(o[0].b.b.a).toEqual(12)
            expect(o[0].d.b.a).toEqual(24)
            done()
        }}).play()
    })
    it("should scale up", function (done) {
        a2.player({before: ()=> {
            s = Date.now()
            expect(o[0].b.b.a).toEqual(3)
            expect(o[0].d.b.a).toEqual(6)
        }, after: ()=> {
            e = Date.now()
            d = e - s
            r = d / 4000
            expect(r).toBeCloseTo(1, 1)
            expect(o[0].b.b.a).toEqual(12)
            expect(o[0].d.b.a).toEqual(24)
            done()
        }}).play()
    })
    it("should scale down", function (done) {
        a3.player({
            before: () => {
                s = Date.now()
                expect(o[0].b.b.a).toEqual(3)
                expect(o[0].d.b.a).toEqual(6)
            }, after: () => {
                e = Date.now()
                d = e - s
                r = d / 1000
                expect(r).toBeCloseTo(1, 1)
                expect(o[0].b.b.a).toEqual(12)
                expect(o[0].d.b.a).toEqual(24)
                done()
            }
        }).play()
    })
})
