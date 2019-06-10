import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
	mode: 'production',
	entry: {
		clippy: './src/clippy/index.ts',
		links: './src/links/index.ts',
		merlin: './src/merlin/index.ts',
		rover: './src/rover/index.ts'
	},
	output: {
		path: path.resolve(__dirname, 'output', 'bundles'),
		filename: '[name]/index.js'
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.(png|mp3)$/i,
				use: [
					{
						loader: 'url-loader'
					}
				]
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	}
};

export default config;
