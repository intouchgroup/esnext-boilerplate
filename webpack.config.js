'use strict';

const DEVELOPMENT_MODE = true;

const path = require('path');
const PluginCopy = require('copy-webpack-plugin');

const NODE_MODULES_TO_BABEL = [
	// path.resolve(__dirname, 'node_modules', 'example-module'),
];

const SOURCE_DIRECTORY = path.resolve(__dirname, 'src');

const OUTPUT_DIRECTORY = path.resolve(__dirname, 'dist');

const commonConfig = {
	mode: DEVELOPMENT_MODE ? 'development' : 'production',
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
	devtool: DEVELOPMENT_MODE ? 'eval' : '', // Script source maps
	performance: {
		hints: DEVELOPMENT_MODE ? false : 'warning',
	},
	stats: 'normal',
};

const appConfig = {
	...commonConfig,
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
				info: DEVELOPMENT_MODE,
			},
		),
	],
	devServer: {
		contentBase: OUTPUT_DIRECTORY,
		hot: false,
		historyApiFallback: true,
	},
};

module.exports = [
	appConfig,
];
