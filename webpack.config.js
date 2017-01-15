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
        publicPath: '/',   // internet path for require.ensure
        filename: '[name].js'
        // library: '[name]'  // exports global var
    },
    externals: {
        "jquery": "$",
        "lodash": "_"
    },

    watch: isDevelopment,
    watchOption: {
        aggregateTimeout: 100
    },

    devtool: isDevelopment ? "#inline-source-map" : null,

    module: {
        loaders: [
            {  // change code and its source map
                test: /\.js$/,
                include: path.join(__dirname, 'src'),  // better than exclude: /(node_modules|bower_components)/
                loader: 'babel',
                query: {  // loader: 'babel?presets[]=es2015'  // old syntax
                    presets: ['es2015']
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
            NODE_ENV: JSON.stringify(isDevelopment ? "development" : "production")
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({  // automated require on free variable
            $: 'jquery'
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
        moduleTemplates: ['*-loader', '*'],
        extensions: ['', '.js']
    }

};

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