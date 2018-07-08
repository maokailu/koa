const webpack = require('webpack');
module.exports = {
    devtool: 'none',
    entry: __dirname + '/client/index.jsx',
    output: {
        path: __dirname + '/dist',
        publicPath: __dirname + '/dist',
        filename: 'bundle.js'
    },
    // devServer: {
    //     contentBase: 'http://localhost:3000'
    // },
    resolve: {
        extensions: ['.js', '.jsx', '.json', 'ts', 'tsx'],
        alias: {
        }
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: [
                    { loader: 'babel-loader' }
                ],
                exclude: /node_modules/
            }, {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader'
                }]
            },
        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),
        new webpack.HotModuleReplacementPlugin()
    ]
};
