'use strict'


const expect = require('chai').expect
const fantasma = require('./fantasma.js')


describe('fantasma.js', function() {
  it('should have a do function', function() {
    expect(fantasma.do).to.exist
  })
})
