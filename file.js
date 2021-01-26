import {join} from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import {DefinePlugin} from 'webpack'

import {
	name,
	version,
	description,
	keywords,
} from './package.json'

const {
	NODE_ENV = 'production',
	PROJECT_NAME = name || '',
	PROJECT_DESCRIPTION = description || '',
	PROJECT_KEYWORDS = keywords || '',
	BUILD_DIR = 'build',
	WEBPACK_DEVTOOL,
	WEBPACK_DEV_SERVER_HOST = '0.0.0.0',
	WEBPACK_DEV_SERVER_PORT = 3001,
	WEBPACK_PUBLIC_PATH = '/',
	WEBPACK_HASH_LENGTH = 10,
} = process.env

const isDevelopment = NODE_ENV === 'development'
const buildDirAbsolutePath = join(__dirname, BUILD_DIR)

const devServer = {
	host: WEBPACK_DEV_SERVER_HOST,
	port: WEBPACK_DEV_SERVER_PORT,
	contentBase: buildDirAbsolutePath,
	stats: {colors: true},
}

const entry = {
	[PROJECT_NAME]: join(__dirname, 'src/index.js'),
}

const output = {
	path: buildDirAbsolutePath,
	filename: isDevelopment ?
		`assets/[name]-[hash:${WEBPACK_HASH_LENGTH}].js` :
		`assets/[name]-[chunkhash:${WEBPACK_HASH_LENGTH}].js`,
	publicPath: isDevelopment ? '/' : WEBPACK_PUBLIC_PATH,
}

const plugins = {
	common: [
		new DefinePlugin({
			IS_DEVELOPMENT: JSON.stringify(isDevelopment),
			PROJECT_NAME: JSON.stringify(PROJECT_NAME),
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'src/index.ejs',
			title: PROJECT_NAME,
			meta: {
				description: PROJECT_DESCRIPTION,
				keywords: PROJECT_KEYWORDS,
			},
			inject: 'body',
			cache: true,
			minify: !isDevelopment && {
				removeComments: true,
				collapseWhitespace: true,
				conservativeCollapse: true,
			},
		}),
	],

	development: [
		/*new HotModuleReplacementPlugin(),*/
	],

	production: [],
}

const fileNameFormat = `[name]-[hash:${WEBPACK_HASH_LENGTH}].[ext]`

const getFileLoader = (location) => ({
	loader: 'file-loader',
	options: {
		name: `assets/${location}/${fileNameFormat}`,
	},
})

const rules = {
	common: [{
		test: /\.js$/,
		exclude: /node_modules/,
		use: ['babel-loader'],
	}],

	development: [{
		test: /\.(png|jpg|jpeg|gif)$/,
		use: [getFileLoader('img')],
	}],

	production: [/*{
    test: /\.(png|jpg|jpeg|gif)$/,
    use: [
      graphicsLoader, {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
            quality: 90,
          },
          optipng: {
            optimizationLevel: 6,
          },
          gifsicle: {
            interlaced: true,
          },
        },
      },
    ],
  }*/],
}

export default {
	mode: NODE_ENV,
	entry,
	output,
	devtool:
		WEBPACK_DEVTOOL ||
		(isDevelopment ? 'eval-cheap-source-map' : undefined),
	plugins: isDevelopment ?
		[...plugins.common, ...plugins.development] :
		[...plugins.common, ...plugins.production],
	module: {
		rules: isDevelopment ?
			[...rules.common, ...rules.development] :
			[...rules.common, ...rules.production],
	},
	devServer,
}
