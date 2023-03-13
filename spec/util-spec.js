"use strict"


const { Resolver } = require("../lib/util.js")


describe("Resolver", function () {
    let o, r
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
        r = [
            [
                new Resolver(o[0], "a"),
                new Resolver(o[0], "b", "b", "a"),
                new Resolver(o[0], "d", "b", "a"),
            ]
        ]
    })
    it("should take an object and a series of property names", function () {
        expect(r[0][0].obj).toEqual(o[0])
        expect(r[0][1].obj).toEqual(o[0])
        expect(r[0][2].obj).toEqual(o[0])
        expect(r[0][0].prop.length).toEqual(1)
        expect(r[0][1].prop.length).toEqual(3)
        expect(r[0][2].prop.length).toEqual(3)
    })
    it("should record the initial value", function () {
        expect(r[0][0].initial).toEqual(1)
        expect(r[0][1].initial).toEqual(3)
        expect(r[0][2].initial).toEqual(6)
    })
    it("should return the resolved value", function () {
        expect(r[0][0].val).toEqual(1)
        expect(r[0][1].val).toEqual(3)
        expect(r[0][2].val).toEqual(6)
    })
    it("should set the resolved value", function () {
        r[0][0].val = 77
        r[0][1].val = 88
        r[0][2].val = 99
        expect(r[0][0].val).toEqual(77)
        expect(r[0][1].val).toEqual(88)
        expect(r[0][2].val).toEqual(99)
        expect(r[0][0].initial).toEqual(1)
        expect(r[0][1].initial).toEqual(3)
        expect(r[0][2].initial).toEqual(6)
    })
})
