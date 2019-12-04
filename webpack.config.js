'use strict';

const path = require('path');
const PluginCopy = require('copy-webpack-plugin');

const NODE_MODULES_TO_BABEL = [
	// path.resolve(__dirname, 'node_modules', 'example-module'),
];

const SOURCE_DIRECTORY = path.resolve(__dirname, 'src');

const OUTPUT_DIRECTORY = path.resolve(__dirname, 'dist');

const commonConfig = (devMode) => ({
	mode: devMode ? 'development' : 'production',
	context: SOURCE_DIRECTORY,
	resolve: {
		extensions: [ '.js' ],
		alias: {
			Constants: path.resolve(SOURCE_DIRECTORY, 'constants'),
			Components: path.resolve(SOURCE_DIRECTORY, 'components'),
			Data: path.resolve(SOURCE_DIRECTORY, 'data'),
			Services: path.resolve(SOURCE_DIRECTORY, 'services'),
		},
	},
	module: {
		rules: [
			{
				test: /\.html/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
				},
			},
			{
				test: /\.tsx?$/,
				loader: 'eslint-loader',
				enforce: 'pre',
				include: [
					SOURCE_DIRECTORY,
				],
				options: {
					fix: true,
				},
			},
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				include: [
					SOURCE_DIRECTORY,
					NODE_MODULES_TO_BABEL,
				],
			},
		],
	},
	devtool: devMode ? 'eval' : '', // Script source maps
	performance: {
		hints: devMode ? false : 'warning',
	},
	stats: 'normal',
});

const appConfig = (devMode) => ({
	...commonConfig(devMode),
	entry: [
		'core-js/stable',
		'./index.js',
	],
	output: {
		path: OUTPUT_DIRECTORY,
		filename: 'bundle.js',
	},
	plugins: [
		new PluginCopy(
			[
				{
					from: path.resolve(SOURCE_DIRECTORY, 'assets'),
					to: path.resolve(OUTPUT_DIRECTORY, 'assets'),
				},
				{
					from: path.resolve(SOURCE_DIRECTORY, 'index.html'),
					to: path.resolve(OUTPUT_DIRECTORY, 'index.html'),
				},
			],
			{
				info: devMode,
			},
		),
	],
	devServer: {
		contentBase: OUTPUT_DIRECTORY,
		hot: false,
		historyApiFallback: true,
	},
});

module.exports = (env, argv) => {
	const devMode = argv.prod === undefined ? true : false;

	return [
		appConfig(devMode),
	];
};
