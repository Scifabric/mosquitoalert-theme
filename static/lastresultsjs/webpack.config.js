// webpack.config.js
module.exports = {
  // entry point of our application
  entry: './lastresults.js',
  // where to place the compiled bundle
  output: {
    path: '../js/',
    filename: 'lastresults.js'
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
}
