const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;
const mode = () => (isProd ? "production" : "development");
const filename = (ext) => (isProd ? `bundle.[contenthash].${ext}` : `bundle.${ext}`);

module.exports = {
    mode: mode(),
    context: path.resolve(__dirname, "src"),
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: filename("js"),
    },
    resolve: {
        extensions: [".js"],
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@core": path.resolve(__dirname, "src/core"),
        },
    },
    devtool: isDev ? "source-map" : false,
    devServer: {
        port: 4200,
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd,
            },
        }),
        new MiniCssExtractPlugin({
            filename: filename("css"),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/favicon.ico"),
                    to: path.resolve(__dirname, "dist"),
                },
            ],
        }),
        new ESLintWebpackPlugin({
            files: "{**/*,*}.{js}",
        }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/,
            },
        ],
    },
};
