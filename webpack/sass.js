module.exports = function(paths) {
    return {
        module: {
            rules: [{
                test: /\.scss$/,
                include: paths,
                use: ['style-loader', 'css-loader', 'autoprefixer-loader?browsers=last 2 versions', 'sass-loader?sourceMap']
            }]
        }
    };
};