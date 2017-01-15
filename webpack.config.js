const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
const webpack = require('webpack');
var path = require('path');

module.exports = {
    context: path.join(__dirname, 'src'),
    entry: {
        popup: './popup.js',  // extension (popup) script
        messagingTest: './messagingTest.js',
        page: './page.js'  // content script
    },
    output: {
        path: 'webapp',
        filename: '[name].min.js'
        // library: '[name]'
    },
    externals: {
        "jquery": "$",
        "lodash": "_"
    },

    watch: isDevelopment,
    watchOption: {
        aggregateTimeout: 100
    },

    devtool: isDevelopment ? "eval" : null,

    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(isDevelopment ? "development" : "production")
        }),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
        )
    ],

    module: {
        loaders: [{  // change code and its source map
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel?presets[]=es2015',
            // query: {
            //     presets: ['es2015']
            // }

        }]
    },

    resolve: {  // override defaults
        moduleDirectories: ['node_modules', 'bower_components'],
        // extensions: ['', '.js']
    },
    resolveLoader: {  // override defaults
        moduleDirectories: ['node_modules', 'bower_components'],
        // moduleTemplates: ['*-loader', '*'],
        // extensions: ['', '.js']
    }

};

// if (!isDevelopment) {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
// }