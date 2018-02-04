// This is vendor "dll". It is only compiled when there is no "Content/Bundle" folder.
// So if there are any changes in this file (or in any code referenced from this file, such as npm packages),
// you need to manualy delete "Content/Bundle" folder and rebuild visual studio solution

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env) => {
    const extractCSS = new ExtractTextPlugin('vendor.css');
    const isDevBuild = !(env && env.prod);
    return [{
        stats: { modules: false },
        resolve: {
            extensions: [ '.js' ]
        },
        module: {
            rules: [
                { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' },
                { test: /\.css(\?|$)/, use: extractCSS.extract([ isDevBuild ? 'css-loader' : 'css-loader?minimize' ]) }
            ]
        },
        entry: {
            vendor: [
                // empty css. This is to force creating vendor.css file, even if no css is using (To avoid 404 error from <link> tag to vendor.css)
                './WebpackConfig/empty.css',

                'event-source-polyfill', 'isomorphic-fetch',

                // react
                'react', 'react-dom', 'react-router-dom', 'react-hot-loader'

                // other vendor packages go here
            ]
        },
        output: {
            path: path.join(__dirname, 'Content', 'Bundle'),
            publicPath: 'Content/Bundle/',
            filename: '[name].js',
            library: '[name]_[hash]',
        },
        plugins: [
            extractCSS,
            new webpack.DllPlugin({
                path: path.join(__dirname, 'Content', 'Bundle', '[name]-manifest.json'),
                name: '[name]_[hash]'
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            })
        ].concat(isDevBuild ? [] : [
            new webpack.optimize.UglifyJsPlugin()
        ])
    }];
};
