const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinPlugin = require('imagemin-webpack')

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
	devtool: isDev ? 'source-map' : false,
	entry: path.join(__dirname, 'src/index.js'),
	output: {
		filename: 'app.js',
		path: path.join(__dirname, 'dist'),
		publicPath: ''
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					format: {
						comments: false,
					},
				},
				extractComments: false,
			}),
		],
	},
	devServer: {
		port: 9000,
		contentBase: path.join(__dirname, 'dist')
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		}),
		new MiniCssExtractPlugin({
			filename: 'css/style.css'
		}),
		new CleanWebpackPlugin()
	],
	module: {
		rules: [
			{
				test: /\.html$/,
				use: ['html-loader']
			},
			{
				test: /\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: "../"
						}
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'resolve-url-loader',
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(png|jpg|svg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'assets/imgs'
						}
					},
					{
						loader: ImageMinPlugin.loader,
						options: {
							bail: false,
							cache: false,
							imageminOptions: {
								plugins: [
									['pngquant', {speed: 1, strip: true, dithering: 1, posterize: 1, quality: [0, 0.95],}],
									['mozjpeg', {quality: 90, progressive: true}],
									['gifsicle', {interlaced: true, optimizationLevel: 3}],
									['svgo',
										{
											plugins: [
												{
													removeViewBox: false,
												},
											],
										},
									],
								]
							}
						}
					}
				]
			},
			{
				test: /\.(woff|woff2)$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'assets/fonts'
					}
				}
				]
			}

		]
	}
}