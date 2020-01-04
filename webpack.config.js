const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    output: {
        filename: 'app.js',
    },
    module: {
        rules: [
            // ts
            {
                test: /\.ts$/,
                use: [
                    'babel-loader',
                    'ts-loader',
                ],
            },
            // sass
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            // images
            {
                test: /\.(jpe?g|gif|png)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                        context: 'src/scss/image',
                        outputPath : 'image',
                    },
                },
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'app.css',
        }),
    ],
};
