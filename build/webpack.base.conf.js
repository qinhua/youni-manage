var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var vuxLoader = require('vux-loader')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
var originalConfig = {
  entry: {
    // 'babel-polyfill': 'babel-polyfill', // 用来解决的兼容性
    app: ['babel-polyfill','./src/main.js']
  },
  // 此处配置jquery等外部插件
  // plugins: [
  //  new webpack.optimize.CommonsChunkPlugin('common.js'),
  //  new webpack.ProvidePlugin({
  //    jQuery: "jquery",
  //    $: "jquery"
  //  })
  // ],
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'axios': 'axios/dist/axios.js',
      'myMixin': '../static/js/myMixin.js'
    }
  },
  module: {
    rules: [
      /* {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      }, */
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
var webpackConfig = originalConfig

module.exports = vuxLoader.merge(webpackConfig, {
  plugins: ['vux-ui']
})
