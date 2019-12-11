module.exports = {
	mode: "development",
	devtool: "inline-source-map",
	entry: "./src/renderer/StartupTasks.ts",
	output: {
		filename: "./dist/renderer.bundle.js",
		libraryTarget: "window"
	},
	resolve: {
		// Add `.ts` and `.tsx` as a resolvable extension.
		extensions: [".ts", ".tsx", ".js"]
	},
	module: {
		rules: [
			// all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
			{ test: /\.tsx?$/, loader: "ts-loader" },
			{ test: /\.pug/, loader: "pug-loader"}
		]
	},
	target: "electron-renderer"
};