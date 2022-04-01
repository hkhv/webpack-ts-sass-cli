

const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    mode: "production",
    entry: {
        "index": "./src/ts/index.ts"
    },
    devtool: false,
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/assets', to: 'assets' },
            ]
        }),
        new HtmlWebpackPlugin({
            template: 'src/sites/cn/index.html',
            inject: 'body',
            xhtml: true,
            metadata: {
                isDevServer: false
            },
            minify: {
              caseSensitive: true,
              collapseWhitespace: true,
              keepClosingSlash: true
            },
            chunks: 'all',
            filename: 'index.html'
        })
    ],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[chunkhash].bundle.js',
        sourceMapFilename: '[file].map',
        chunkFilename: '[name].[chunkhash].chunk.js'
    }
}
