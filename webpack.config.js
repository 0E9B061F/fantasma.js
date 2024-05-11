"use strict"


const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin')

const MODE = process.env.NODE_ENV || "production"
const BUILD = process.env.FANJS_BUILD || "library"
let DIST = `./dist-${BUILD}-${MODE}`

let entry = "./build.js"
let rules = [
  { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
]
let plugins = []

if (BUILD != "library") {
  DIST = `./examples/${BUILD}/dist-${BUILD}-${MODE}`
  entry = `./examples/${BUILD}/entry.js`
  rules = [
    ...rules,
    { test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    },
    { test: /\.s[ac]ss$/i,
      use: [ "style-loader", "css-loader", "sass-loader" ],
    },
  ]
  plugins = [
    new HtmlWebpackPlugin({
      title: `${BUILD} | Fantasma Example`,
      inject: "body",
    }),
  ]
}

console.log(`BUILDING ${BUILD} IN ${MODE} TO ${DIST}`)


module.exports = {
  entry,
  mode: MODE,
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, DIST),
    filename: "fantasma.js",
    library: "Fantasma",
    libraryTarget: "var",
  },
  module: { rules },
  resolve: {
    extensions: ['*', '.js']
  },
  plugins,
}
