import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
	mode: 'production',
	entry: {
		clippy: './src/clippy.ts'
	},
	output: {
		path: path.resolve(__dirname, 'output'),
		filename: 'modern-[name].js'
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	}
};

export default config;
