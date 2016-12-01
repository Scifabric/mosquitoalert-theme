// webpack.config.js
module.exports = {
  // entry point of our application
  entry: './search.js',
  // where to place the compiled bundle
  output: {
    path: '../js/',
    filename: 'searchresults.js'
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
    ],
    noParse: /dist\/ol.js/,
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js'
    }
  },
}
