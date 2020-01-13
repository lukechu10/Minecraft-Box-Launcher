const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	devtool: "inline-source-map",
	entry: "./src/renderer/StartupTasks.ts",
	output: {
		filename: "./renderer.bundle.js",
		libraryTarget: "window"
	},
	resolve: {
		// Add `.ts` and `.tsx` as a resolvable extension.
		extensions: [".ts", ".tsx", ".js"]
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
			filename: path.resolve(__dirname, "dist", "views", "instances.html")
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src", "renderer", "views", "news.pug"),
			filename: path.resolve(__dirname, "dist", "views", "news.html")

		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "src", "renderer", "views", "settings.pug"),
			filename: path.resolve(__dirname, "dist", "views", "settings.html")

		})
	],
	target: "electron-renderer"
};
