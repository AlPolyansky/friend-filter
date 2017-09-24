const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const devserver = require('./webpack/devserver');
const sass = require('./webpack/sass');
const handlebars = require('./webpack/handlebars');
const webpack = require('webpack');

const PATHS = {
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build')
}

module.exports = merge([{
        entry: PATHS.src + '/index.js',
        output: {
            path: PATHS.build,
            filename: 'js/[name].bundle.js'
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlPlugin({
                title: 'Webpack app',
                template: `${PATHS.src}/templates/index.hbs`,
            }),
            new CleanWebpackPlugin(['build'])
        ],
        module: {
            rules: [{
                test: /\.(jpe?g|png|gif|svg|)$/i,
                loader: 'file-loader?name=img/[name].[ext]'
            }]
        }
    },
    sass(),
    handlebars(),
    devserver(),
]);