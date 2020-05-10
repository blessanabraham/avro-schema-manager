const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const safePostCssParser = require("postcss-safe-parser");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const appPackageJson = require("./package.json");

const outDir = path.resolve(process.env.OUT_DIR || "", "public");

const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";

const publicPath = process.env.ASSET_PATH || "/static/";

module.exports = {
    entry: {
        main: path.resolve("src", "index.tsx"),
    },
    output: {
        publicPath,
        path: outDir,
        pathinfo: isDev,
        futureEmitAssets: true,
        filename: isProd ? "[name].[contenthash:8].js" : "bundle.js",
        chunkFilename: isProd ? "[contenthash:8].js" : "[name].chunk.js",
        // Prevents conflicts when multiple Webpack runtimes (from different apps)
        // are used on the same page.
        jsonpFunction: `webpackJsonp${appPackageJson.name}`,
        // this defaults to 'window', but by setting it to 'this' then
        // module chunks which are built will work in web workers as well.
        globalObject: "this",
    },
    mode: process.env.NODE_ENV || "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                enforce: "pre",
                loader: "eslint-loader",
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                options: {
                    logLevel: "error",
                    reportFiles: ["./src/**/*.ts"],
                    useCache: true,
                },
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8000, // Convert images < 8kb to base64 strings
                            name: "static/media/[hash]-[name].[ext]",
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: outDir,
                        },
                    },
                    {
                        loader: "css-loader",
                        options: {
                            import: true,
                            localsConvention: "camelCaseOnly",
                            modules: true,
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            debug: true,
                            config: {
                                path: path.resolve("postcss.config.js"),
                            },
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: outDir,
                        },
                    },
                    {
                        loader: "dts-css-modules-loader",
                        options: {
                            namedExport: true,
                            banner: "// This file is generated automatically",
                        },
                    },
                    {
                        loader: "css-loader",
                        options: {
                            localsConvention: "camelCaseOnly",
                            modules: {
                                mode: "local",
                                localIdentName: "[name]__[local]",
                            },
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            config: {
                                path: path.resolve(
                                    __dirname,
                                    "postcss.config.js"
                                ),
                            },
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".scss"],
        modules: [path.resolve(__dirname, "styles"), "node_modules"],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(
            Object.assign(
                {},
                {
                    inject: true,
                    title: `Avro Schema Manager | ${appPackageJson.version}`,
                    template: path.resolve(__dirname, "index.html"),
                },
                isProd
                    ? {
                          minify: {
                              removeComments: true,
                              collapseWhitespace: true,
                              removeRedundantAttributes: true,
                              useShortDoctype: true,
                              removeEmptyAttributes: true,
                              removeStyleLinkTypeAttributes: true,
                              keepClosingSlash: true,
                              minifyJS: true,
                              minifyCSS: true,
                              minifyURLs: true,
                          },
                      }
                    : undefined
            )
        ),
        new MiniCssExtractPlugin({
            filename: isProd ? "[name].[contenthash:8].css" : "bundle.css",
            chunkFilename: isProd ? "[contenthash:8].css" : "[name].chunk.css",
        }),
        new webpack.DefinePlugin({
            global: "window", // Placeholder for global used in any node_modules
        }),
    ],
    node: {
        // global: false,
        module: "empty",
        dgram: "empty",
        dns: "mock",
        fs: "empty",
        http2: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty",
    },
    optimization: {
        minimize: isProd,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true,
                    },
                    parallel: true,
                    cache: true,
                    sourceMap: true,
                },
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    parser: safePostCssParser,
                    map: {
                        inline: false,
                        annotation: true,
                    },
                },
            }),
        ],
        runtimeChunk: {
            name: (entrypoint) => `runtime-${entrypoint.name}`,
        },
        // splitChunks: {
        //     chunks: "all",
        //     name: false,
        // },
    },
    devServer: {
        contentBase: outDir,
        index: "static/index.html",
    },
};
