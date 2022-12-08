import { WebpackConfiguration } from "webpack-cli";
import * as path from "path";
import CopyPlugin from "copy-webpack-plugin";

const config: WebpackConfiguration = {
    entry: path.join(__dirname, "src/main.ts"),
    target: "web",
    module: {
        rules: [
            {
                test: /\.ts/,
                loader: "ts-loader",
            },
            {
                test: /\.scss/,
                use: [
                    "styles-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    resolve: {
        extensions: [ ".js", ".ts" ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.join(__dirname, "src/index.html"), to: "index.html" },
                { from: path.join(__dirname, "assets"), to: "assets" },
                { from: path.join(__dirname, "rulesets"), to: "rulesets" },
            ],
        }),
    ],
};

export default config;
