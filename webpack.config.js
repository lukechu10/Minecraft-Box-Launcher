const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const baseChunks = ["runtime", "vendors", "turbolinks", "startupTasks"];

module.exports = (env, argv) => {
	return {
		devtool: argv.mode === "development" ? "inline-source-map" : "none",
		optimization: {
			splitChunks: {
				chunks: "all",
				minChunks: 1,
				cacheGroups: {
					vendor: {
						name: "vendors",
						test: /node_modules/,
						chunks: "initial",
						enforce: true
					}
				}
			},
			runtimeChunk: {
				name: "runtime"
			},
			flagIncludedChunks: true,
			usedExports: true,
			minimize: argv.mode === "production",
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						compress: {
							arrows: true,
							arguments: true,
							booleans: true,
							ecma: "2016",
							inline: true,
							passes: 3,
							unsafe_arrows: true,
							toplevel: true,
							drop_console: true
						},
						mangle: true,
						topLevel: true,
						keep_classnames: false,
						keep_fnames: false,
						safari10: false,
						ie8: false,
						output: {
							beautify: false
						}
					}
				})
			]
		},
		entry: {
			startupTasks: "./src/renderer/StartupTasks.ts",
			turbolinks: "./src/renderer/turbolinks.ts"
		},
		output: {
			filename: "[name].js",
			libraryTarget: "window"
		},
		resolve: {
			// Add `.ts` and `.tsx` as a resolvable extension.
			extensions: [".ts", ".tsx", ".js", ".json", ".node"]
		},
		module: {
			rules: [
				// all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
				{
					test: /\.tsx?$/,
					include: path.resolve(__dirname, "src"),
					loader: "ts-loader"
				},
				{
					test: /\.pug/,
					include: path.resolve(__dirname, "src", "renderer"),
					loader: "pug-loader"
				}
			]
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, "src", "renderer", "views", "instances.pug"),
				filename: path.resolve(__dirname, "dist", "views", "instances.html"),
				inject: "head",
				chunks: [
					...baseChunks
				]
			}),
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, "src", "renderer", "views", "news.pug"),
				filename: path.resolve(__dirname, "dist", "views", "news.html"),
				inject: "head",
				chunks: [...baseChunks]
			})
		],
		target: "electron-renderer"
	};
};
