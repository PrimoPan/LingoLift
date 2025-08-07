const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './index.web.js',
    resolve: {
        alias: {
            'react-native$': 'react-native-web',
        },
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'), // 指定静态文件目录
        },
        hot: true,
        port: 3000,
        historyApiFallback: true,  // 处理HTML5路由
        open: true,  // 启动时自动打开浏览器
    },
};
