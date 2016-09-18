'use babel'

var path = require('path')
var webpack = require('webpack')

var baseSrcPath = '/Users/mukeshsoni/Documents/main_service/frontend/harmony' // NOTE: read this from config ?

// TODO: problems to solve
// 1. src/pp/modules/root/less
// 2. src/fonts (modified pp-common-font.less)
module.exports = function () {
  return {
    devtool: 'eval',
    entry: [
      path.join(__dirname, 'index-for-webpack.js')
    ],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    plugins: [
      new webpack.NoErrorsPlugin()
    ],
    resolve: {
      modules: ['', 'node_modules', 'bower_components', path.resolve(baseSrcPath) + '/src', path.resolve(baseSrcPath) + '/src/pp/core/less', path.resolve(baseSrcPath) + '/src/pp/modules/root/less'],
      extensions: ['', '.js', '.jsx', '.less']
    },
    resolveLoader: {
      root: path.join(__dirname, 'node_modules'),
      modules: [__dirname, path.resolve(__dirname, '../../../node_modules')]
    },
    module: {
      preLoaders: [
        {
          test: /\.less$/,
          loader: path.resolve(path.join(__dirname, 'loaders/addtilde'))
        }
      ],
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel',
          exclude: /node_modules/
        },
        { test: /\.less$/, loader: 'style!css!less' },
        { test: /\.css$/, loader: 'style!css' },
        {
          test: /\.(png|jpg|jpeg|gif|woff|ttf)$/,
          loader: 'file'
        // include: path.join(path.resolve(baseSrcPath), 'src/fonts')
        }
      ]
    }
  }
}
