"use strict"


class Resolver {
    constructor(obj, ...prop) {
        this.obj = obj
        this.prop = prop
        this.initial = this.val
    }
    resolve() {
        let o = this.obj
        for (let x = 0; x < this.prop.length; x++) {
            if (this.prop[x+1]) o = o[this.prop[x]]
            else return [o, this.prop[x]]
        }
    }
    get val() {
        const [o, p] = this.resolve()
        return o[p]
    }
    set val(v) {
        const [o, p] = this.resolve()
        return o[p] = v
    }
}

const flat =arr=> {
    let out = []
    let item
    for (let i = 0; i < arr.length; i += 1) {
        item = arr[i]
        if (Array.isArray(item)) out = out.concat(flat(item))
        else out.push(item)
    }
    return out
}


module.exports = { Resolver, flat }
