const webpack = require('webpack');
const path = require('path');
module.exports = {
    mode: 'development',
    devtool: 'none',
    entry: [
        'webpack-hot-middleware/client', // koa-webpack-hot-middlewate无效
        path.resolve(__dirname, './client/index.jsx'),
      ],
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: "http://localhost:3000/",
        filename: 'bundle.js'
    },
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
