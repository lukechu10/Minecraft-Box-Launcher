const path = require("path");
const _ = require("lodash");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const baseChunks = ["runtime", "vendors", "turbolinks", "startupTasks"];

const baseConfig = {
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
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src", "renderer", "views", "home.pug"),
			filename: path.resolve(__dirname, "dist", "views", "home.html"),
			inject: "head",
			chunks: [...baseChunks]
		})
	],
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
		}
	},
	target: "electron-renderer",
	externals: {
		"@xmcl/installer": "commonjs2 @xmcl/installer",
		"@xmcl/client": "commonjs2 @xmcl/client",
		"got": "commonjs2 got",
		"uuid": "commonjs2 uuid"
	}
};

module.exports = [
	_.defaults({
		name: "development",
		devtool: "inline-source-map",
		mode: "development"
	}, baseConfig),
	_.defaults({
		name: "production",
		optimization: {
			flagIncludedChunks: true,
			usedExports: true,
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
		mode: "production"
	}, baseConfig),
	_.defaults({
		name: "coverage",
		devtool: "inline-source-map",
		mode: "development",
		module: {
			rules: [
				// all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
				{
					test: /\.tsx?$/,
					include: path.resolve(__dirname, "src"),
					use: [
						{
							loader: "coverage-istanbul-loader"
						},
						{
							loader: "ts-loader",
							options: {
								compilerOptions: {
									removeComments: false
								}
							}
						}
					]
				},
				{
					test: /\.pug/,
					include: path.resolve(__dirname, "src", "renderer"),
					loader: "pug-loader"
				}
			]
		}
	}, baseConfig)
];
