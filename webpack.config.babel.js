import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const entry = path.join(__dirname, 'src/index.js')

const output = {
	path: path.join(__dirname, 'build'),
	filename: '[name].[hash].js',
	publicPath: '/'
}

const plugins = [
	new HtmlWebpackPlugin({
		/*filename: 'index.html'*/
		template: 'src/index.html',
		cache: true,
	}),
]

const rules = [
	{
		test: /\.js$/,
		use: ['babel-loader']
	},
	{
		test: /.scss$/,
		use: ['style-loader', 'css-loader', 'sass-loader']
	},
	{
		test: /\.(png|jpg|jpeg|gif)$/,
		use: [{
			loader: 'file-loader',
			options: {
				name: 'assets/[name].[hash].[ext]'
			}
		}]
	}
]

const devServer = {
	host: '0.0.0.0',
	port: '3000',
	contentBase: path.join(__dirname, 'build'),
}

export default {
	entry: entry,
	output : output,
	plugins: plugins,
	module: {
		rules: rules
	},
	devServer: devServer,
}