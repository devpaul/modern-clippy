import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
	mode: 'production',
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'output')
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
