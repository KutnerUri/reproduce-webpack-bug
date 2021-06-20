const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const html = require('./html');

const workDir = __dirname;
const stylesRegexps = {
	cssRegex: /\.css$/,
	cssNoModulesRegex: /(?<!\.module)\.css$/,
	cssModuleRegex: /\.module\.css$/,

	sassRegex: /\.(scss|sass)$/,
	sassNoModuleRegex: /(?<!\.module)\.(scss|sass)$/,
	sassModuleRegex: /\.module\.(scss|sass)$/,

	lessRegex: /\.less$/,
	lessNoModuleRegex: /(?<!\.module)\.less$/,
	lessModuleRegex: /\.module\.less$/,
}

const moduleFileExtensions = ['.wasm', '.web.js', '.js', '.web.ts', '.ts', '.web.mjs', '.mjs', '.web.tsx', '.tsx', '.json', '.web.jsx', '.jsx'];
const fileMapPath = path.resolve(__dirname, './map.json');


module.exports = {
	devServer: {
		// contentBase: path.join(__dirname, 'dist'),
		// compress: true,
		port: 9000,
		hot: true,
	},
	module: {
		rules: [
			// fix error `Can't resolve './graphql'. Should be resolved by resolve.extentions
			{
				test: /\.m?js/,
				include: [/node_modules\/graphql/],
				resolve: { fullySpecified: false },
			},
			{
				test: /\.(mjs|js|jsx|tsx|ts)$/,
				exclude: [/node_modules/, /dist/],
				include: workDir,
				// TODO - this should be handled by the general `resolve.extensions` option
				resolve: { fullySpecified: false },

				loader: require.resolve('babel-loader'),
				options: {
					babelrc: false,
					configFile: false,
					presets: [require.resolve('babel-preset-react-app')],
					plugins: [
						require.resolve('react-refresh/babel'),
						// bug be here:
						[require.resolve('@teambit/react.babel.bit-react-transformer'), { componentFilesPath: fileMapPath }],
					],
				},
			},
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				type: 'asset',
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				type: 'asset',
			},

			// * * * style loaders * * *

			{
				test: stylesRegexps.sassModuleRegex,
				use: [
					require.resolve('style-loader'),
					{
						loader: require.resolve('css-loader'),
						options: {
							modules: {
								localIdentName: '[name]__[local]--[hash:base64:5]',
							},
							sourceMap: true,
						},
					},
					{
						loader: require.resolve('sass-loader'),
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: stylesRegexps.sassNoModuleRegex,
				use: [
					require.resolve('style-loader'),
					require.resolve('css-loader'),
					{
						loader: require.resolve('sass-loader'),
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: stylesRegexps.lessModuleRegex,
				use: [
					require.resolve('style-loader'),
					{
						loader: require.resolve('css-loader'),
						options: {
							modules: {
								localIdentName: '[name]__[local]--[hash:base64:5]',
							},
							sourceMap: true,
						},
					},
					{
						loader: require.resolve('less-loader'),
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: stylesRegexps.lessNoModuleRegex,
				use: [
					require.resolve('style-loader'),
					require.resolve('css-loader'),
					{
						loader: require.resolve('less-loader'),
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: stylesRegexps.cssModuleRegex,
				use: [
					require.resolve('style-loader'),
					{
						loader: require.resolve('css-loader'),
						options: {
							modules: {
								localIdentName: '[name]__[local]--[hash:base64:5]',
							},
							sourceMap: true,
						},
					},
				],
			},
			{
				test: stylesRegexps.cssNoModulesRegex,
				use: [require.resolve('style-loader'), require.resolve('css-loader')],
			},
		],
	},
	resolve: {
		extensions: moduleFileExtensions,
	},

	plugins: [
		new HtmlWebpackPlugin({
			templateContent: html(),
			filename: 'index.html',
		}),
		new ReactRefreshWebpackPlugin({
			include: [/\.(js|jsx|tsx|ts)$/],
			// TODO: use a more specific exclude for our selfs
			exclude: [/dist/, /node_modules/],
		}),
	],
};