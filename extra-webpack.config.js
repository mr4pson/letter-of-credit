const CopyPlugin = require("copy-webpack-plugin");
const RemovePlugin = require('remove-files-webpack-plugin');
const path = require('path');
const fs = require('fs');
const crypto = require("crypto");


module.exports = {
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "**/16/*.svg",
                    to: "../assets/[name].[hash:20].[ext]",
                },
            ],
        }),
        new RemovePlugin({
            after: {
                allowRootAndOutside: true,
                //root: '../www',
                test: [
                    {
                        folder: '../../server/www/inner',
                        method: (absoluteItemPath) => {
                            return new RegExp(/\.svg$/, 'm').test(absoluteItemPath);
                        }
                    }
                ],
            }
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(svg|png|jpe?g|gif)$/i,
                loader: "file-loader",
                options: {
                    emitFile: false,
                    name(resourcePath, resourceQuery) {
                        // `resourcePath` - `/absolute/path/to/file.js`
                        // `resourceQuery` - `?foo=bar`

                        let fileContent = fs.readFileSync(resourcePath);
                        let hash = crypto.createHash('md4').update(fileContent).digest('hex').substr(0, 20);

                        return `../assets/[name].${hash}.[ext]`;
                    },
                },
            },
        ],
    },

    /*
    module: {
        rules: [
            {
                test: /\.(svg|png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    "name": "assets/[name].[hash].[ext]",
                    "esModule": false
                },
            },
        ],
    },
    */
    output: {
        jsonpFunction: 'webpackJsonpLetterOfCredit',
        library: 'loc'
    }
};
