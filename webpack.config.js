const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const elmMinify = require("elm-minify");

const HTMLWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

var MODE =
    process.env.npm_lifecycle_event === "prod" ? "production" : "development";
var withDebug = !process.env["npm_config_nodebug"];
console.log('\x1b[36m%s\x1b[0m', `** elm-webpack-starter: mode "${MODE}", withDebug: ${withDebug}\n`);

var common = {
    entry: ["./src/index.js", "./src/worker.js"],
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/",
        // FIXME webpack -p automatically adds hash when building for production
        filename: MODE == "production" ? "[name]-[hash].js" : "index.js"
    },
    plugins: [
        new HTMLWebpackPlugin({
            // Use this template to get basic responsive meta tags
            template: "src/index.html",
            // inject details of output file at end of body
            inject: "body"
        })
    ],
    resolve: {
        modules: [path.join(__dirname, "src"), "node_modules"],
        extensions: [".js", ".elm"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};

if (MODE === "development") {
    module.exports = merge(common, {
        plugins: [
            // Suggested for hot-loading
            new webpack.NamedModulesPlugin(),
            // Prevents compilation errors causing the hot loader to lose state
            new webpack.NoEmitOnErrorsPlugin()
        ],
        module: {
            rules: [
                {
                    test: /\.elm$/,
                    exclude: [/elm-stuff/, /node_modules/],
                    use: [
                        { loader: "elm-hot-webpack-loader" },
                        {
                            loader: "elm-webpack-loader",
                            options: {
                                // add Elm's debug overlay to output
                                debug: withDebug,
                                //
                                forceWatch: true
                            }
                        }
                    ]
                }
            ]
        },
        devServer: {
            inline: true,
            stats: "errors-only",
            contentBase: path.join(__dirname, "src/assets"),
            historyApiFallback: true
        }
    });
}
if (MODE === "production") {
    module.exports = merge(common, {
        plugins: [
            // Minify elm code
            new elmMinify.WebpackPlugin(),
            // Delete everything from /dist directory and report to user
            new CleanWebpackPlugin(["dist"], {
                root: __dirname,
                exclude: [],
                verbose: true,
                dry: false
            })
        ],
        module: {
            rules: [
                {
                    test: /\.elm$/,
                    exclude: [/elm-stuff/, /node_modules/],
                    use: {
                        loader: "elm-webpack-loader",
                        options: {
                            optimize: true
                        }
                    }
                }
            ]
        }
    });
}
