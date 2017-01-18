/* eslint-env node */
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
if (!isDevelopment) {
  console.log('Webpack: executing a production build!');
}

const webpack = require('webpack');
const path = require('path');
const config = require('./config');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    popup: './popup',  // extension's popup script
    background: ['./db', './background'], // background script
    page: './page',  // content script
    messagingTest: './messagingTest',

    // it is required to include all of jQuery plug-ins into the build
    // for ProvidePlugin to be able to substitute require('jquery') statement for the usage of $
    vendor: ['jquery', 'select2', 'lodash/template']  // see vendor/select2
  },

  output: {
    path: 'webapp',
    publicPath: '/',   // internet path for require.ensure
    filename: '[name].js',
    library: '[name]'  // exports global var = [name] from each module
  },

  watch: isDevelopment,
  watchOption: {
    aggregateTimeout: 100
  },

  // other settings may not work for Chrome extension debugging
  devtool: isDevelopment ? "#cheap-module-inline-source-map" : null,

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: "jshint-loader",
      },
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: "eslint-loader"
      }

    ],
    loaders: [
      {  // change code and its source map
        test: /\.js$/,
        include: path.join(__dirname, 'src'),  // better than exclude: /(node_modules|bower_components)/
        loader: 'babel',
        query: {  // loader: 'babel?presets[]=es2015'  // old syntax
          presets: ['es2015'],
          cacheDirectory: true,  // default
          plugins: ['transform-runtime']  // avoid code duplication for babel helpers (npm i babel-plugin-transform-runtime)
        }
      }, {
        test: /\.css$/,
        loaders: ["style", "css"]  // loader: 'style!css'  // old syntax
      }, {
        test: /\.(png|jpe?g|gif|svg|json)$/i,
        loader: 'file?name=[path][name].[ext]'
      }],
    noParse: /\/node_modules\/(jquery\.js|lodash\.js|select2\.full\.js)/  // libs that don't need any parsing (e.g. no require)
  },

  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(isDevelopment ? "development" : "production")  // use NODE_ENV as constant in code
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({  // webpack will add require on free $ variable
      $: 'jquery',
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),

    // Chunks
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "background",  // merge common chunks into background page
    //   //minChunks: 2,  // how many entry points should use a module to form a chunk?
    //   chunks: ["background", "popup", "messagingTest", "page"]
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",  // additional common chunks with the list below will be merged into vendor.js entry point
      chunks: [/*"vendor", */"popup", "messagingTest"],  // explicitly no background module as it will not have access to webpackJsop_name_() function
      //minChunks: Infinity  // ensures that no other modules go into this chunk
    })
  ],


  resolve: {  // override defaults
    root: path.join(__dirname, 'vendor'),  // add another root for require (in addition to node_modules)
    alias: {  // alias: path
      'jquery': 'jquery/dist/jquery.js'  // webpack better optimizes source versions
    },
    moduleDirectories: ['node_modules'],
    extensions: ['', '.js']
  },
  resolveLoader: {  // override defaults
    moduleDirectories: ['node_modules'],
    moduleTemplates: ['*-webpack-loader', '*-loader', '*'],
    extensions: ['', '.js']
  },

  //Specific loaders
  // jshint: {
  //   failOnHint: true
  // },
  eslint: {
    // failOnWarning: true,
    failOnError: true
  }

};

// Offline build (CDN resources)
if(config.isCDN) {
  delete module.exports.entry.vendor;
  module.exports.plugins.pop();  // remove vendor chunk
  module.exports.externals = {  // use CDN versions
    "jquery": "$",
    "lodash": "_"
  };
}

// Additional production options
if (!isDevelopment) {
  module.exports.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: true,
          unsafe: true
        }
      })
  );
}
