const path = require("path");
const _ = require("lodash");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const baseChunks = ["startupTasks"];

const baseConfig = {
	entry: {
		startupTasks: "./src/renderer/StartupTasks.ts",
		home: "./src/renderer/HomeEntry.ts"
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
			filename: path.resolve(__dirname, "dist", "instances.html"),
			inject: "head",
			chunks: [...baseChunks]
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src", "renderer", "views", "news.pug"),
			filename: path.resolve(__dirname, "dist", "news.html"),
			inject: "head",
			chunks: [...baseChunks]
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src", "renderer", "views", "home.pug"),
			filename: path.resolve(__dirname, "dist", "home.html"),
			inject: "head",
			chunks: [...baseChunks, "home"]
		})
	],
	module: {
		rules: [
			// all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
			{
				test: /\.tsx?$/,
				include: path.resolve(__dirname, "src"),
				loader: "ts-loader",
				options: {
					compilerOptions: {
						module: "ESNext"
					}
				}
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
				defaultVendors: {
					test: /[\\/]node_modules[\\/]/,
					priority: -10
				},
				default: {
					minChunks: 2,
					priority: -20,
					reuseExistingChunk: true
				}
			}
		},
		runtimeChunk: {
			name: "runtime"
		},
		providedExports: true,
		usedExports: true
	},
	performance: {
		hints: process.env.NODE_ENV === "production" ? "warning" : false,
		maxEntrypointSize: 2048
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
	_.defaultsDeep({
		name: "development",
		devtool: "inline-source-map",
		mode: "development"
	}, baseConfig),
	_.defaultsDeep({
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
							ecma: "2017",
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
		mode: "production",
		module: {
			rules: [
				// all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
				{
					test: /\.tsx?$/,
					include: path.resolve(__dirname, "src"),
					loader: "ts-loader",
					options: {
						transpileOnly: true,
						compilerOptions: {
							module: "ESNext"
						}
					}
				},
				{
					test: /\.pug/,
					include: path.resolve(__dirname, "src", "renderer"),
					loader: "pug-loader"
				}
			]
		}
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
									removeComments: false,
									module: "ESNext"
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
