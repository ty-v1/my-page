const path = require('path');
const globule = require('globule');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');

/**
 * src/scss/page/ 以下にあるscssと
 * src/ejs/page/ 以下にあるejsの組み合わせを取得する
 */
const getPages = () => {
    const pages = [];
    const matchingFiles = globule.find(['**/ejs/pages/*.ejs'], {cwd: `${__dirname}/src`});
    for (const matchingFile of matchingFiles) {
        const filePath = `${__dirname}/src/${matchingFile}`;
        const name = path.basename(matchingFile, path.extname(matchingFile));
        const entry = {
            [name]: path.resolve(__dirname, 'src', 'scss', 'page', `${name}.scss`),
        };
        const template = new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: filePath,
        });

        pages.push({entry, template});
    }

    return pages;
};

const templates = getPages();
const createWebpackConfigs = (pages) => {
    return pages.map(e => {
        return {
            // entry: entryFiles,
            entry: {
                app: path.resolve(__dirname, 'src', 'index.ts'),
                ...e.entry,
            },
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, 'src')
                }
            },
            module: {
                rules: [
                    // ejs
                    {
                        test: /\.ejs$/,
                        use: [
                            'html-loader',
                            'ejs-html-loader'
                        ]
                    },
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
                                outputPath: 'image',
                            },
                        },
                    },
                ]
            },
            plugins: [
                e.template,
                new MiniCssExtractPlugin({
                    filename: '[name].[hash].css',
                }),
                new FixStyleOnlyEntriesPlugin(),
            ],
        };
    });
};

module.exports = createWebpackConfigs(templates);
