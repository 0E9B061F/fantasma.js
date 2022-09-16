'use strict'


function flat(arr) {
  let out = []
  let item
  for (let i = 0; i < arr.length; i += 1) {
    item = arr[i]
    if (Array.isArray(item)) out = out.concat(flat(item))
    else out.push(item)
  }
  return out
}


module.exports = { flat }
