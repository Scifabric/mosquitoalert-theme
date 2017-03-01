// webpack.config.js
var htmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require("webpack");

module.exports = {
  // entry point of our application
  entry: './lastresults.js',
  // where to place the compiled bundle
  output: {
    path: '../js/',
    filename: 'lastresults.min.js'
  },
  module: {
    // `loaders` is an array of loaders to use.
    // here we are only configuring vue-loader
    loaders: [
      {
        test: /\.vue$/, // a regex for matching all files that end in `.vue`
        loader: 'vue-loader'   // loader to use for matched files
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
      test: /\.css$/,
      loader: "style-loader!css-loader"
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'file-loader?outputPath=../img/search/&publicPath=../img/search/'
      }
    ],
    noParse: /dist\/ol.js/,
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  plugins: [
    new htmlWebpackPlugin({
      inject: false,
      hash: true,
      filename: '../../templates/home/index.html',
      template: '../../templates/home/index.webpack'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]
}
