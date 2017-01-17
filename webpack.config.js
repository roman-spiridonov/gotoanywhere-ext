/* eslint-env node */
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
if (!isDevelopment) {
  console.log('Webpack: executing a production build!');
}

const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    popup: './popup',  // extension's popup script
    //background: './background',  // background script
    page: './page',  // content script
    messagingTest: './messagingTest',
    background: ['jquery', '..\\node_modules\\select2\\dist\\js\\select2.js', './background', './db/index.js']
  },

  output: {
    path: 'webapp',
    publicPath: '/',   // internet path for require.ensure
    filename: '[name].js'
    // library: '[name]'  // exports global var = [name] from each module
  },

  watch: isDevelopment,
  watchOption: {
    aggregateTimeout: 100
  },

  devtool: isDevelopment ? "#cheap-module-inline-source-map" : null,  // other settings may not work for extension debugging

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
    noParse: /(jquery\.js|lodash\.js)/  // libs that don't need any parsing
  },

  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(isDevelopment ? "development" : "production")  // use NODE_ENV as constant in code
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({  // webpack will add require on free $ variable
      $: 'jquery'
    }),

    // Chunks
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: "common",
    //   // minChunks: 2,  // how many entry points should use a module to form a chunk?
    //   chunks: ["background", "popup"]
    // })
    new webpack.optimize.CommonsChunkPlugin({
      name: "background",
      minChunks: Infinity  // how many entry points should use a module to form a chunk?
    })
  ],


  resolve: {  // override defaults
    root: path.join(__dirname, 'vendor'),  // add another root for require
    alias: {  // alias: path

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
    failOnWarning: true,
    failOnError: true
  }

};


// Additional production options
if (!isDevelopment) {
  module.exports.externals = {  // use CDN versions
      "jquery": "$",
      "lodash": "_"
  };
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