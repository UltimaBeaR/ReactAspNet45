const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const bundleOutputDir = './Content/Bundle';

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    process.env.NODE_ENV = isDevBuild ? "development" : "production";

    const buildStyleLoaderChain = (useStyleLoader, minimize, useModules) => {
        let loaders = [];

        // style loader, if needed
        if (useStyleLoader)
            loaders.push('style-loader');

        // css (with configurable options)

        const cssLoader = {
            loader: 'css-loader',
            options: {
                minimize: minimize || false,
                importLoaders: 2 //< sass, postcss
            }
        };

        if (useModules) {
            cssLoader.options.modules = true;
            cssLoader.options.localIdentName = '[name]__[local]__[hash:base64:5]';
        }

        loaders.push(cssLoader);

        // sass/scss
        loaders.push('sass-loader');

        // autoprefixer
        loaders.push({
            loader: 'postcss-loader',
            options: {
                plugins: function () {
                    return [autoprefixer]
                }
            }
        });

        return loaders;
    };

    const buildScssStyleLoaderChain = (isGlobal) => {
        return isDevBuild
            ? buildStyleLoaderChain(true, false, !isGlobal)
            : ExtractTextPlugin.extract({ use: buildStyleLoaderChain(false, true, !isGlobal) })
    };

    return [{
        stats: { modules: false },
        entry: { 'main': './ClientApp/boot.js' },
        resolve: {
            extensions: ['.js', '.jsx'],
            modules: [path.resolve('./ClientApp/react-app'), "node_modules"]
        },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: '[name].js',
            publicPath: 'Content/Bundle/'
        },
        module: {
            rules: [
                { test: /\.jsx?(\?|$)/, include: /ClientApp/, use: { loader: 'babel-loader', options: { cacheDirectory: true } } },
                { test: /\.s?css(\?|$)/, oneOf: [
                    // global styles
                    { test: /\.global\.s?css(\?|$)/, use: buildScssStyleLoaderChain(true) },
                    // local styles
                    { use: buildScssStyleLoaderChain(false) }
                ]},
                { test: /\.(png|jpg|jpeg|gif|svg)(\?|$)/, use: 'url-loader?limit=25000' }
            ]
        },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./Content/Bundle/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            // Plugins that apply in production builds only
            new webpack.optimize.UglifyJsPlugin(),
            new ExtractTextPlugin('site.css')
        ])
    }];
};