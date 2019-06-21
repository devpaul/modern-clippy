import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
	mode: 'production',
	entry: './src/index.ts',
	devtool: 'inline-source-map',
	output: {
		path: path.resolve(__dirname, 'output')
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							minimize: true
						}
					}
				]
			},
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	}
};

export default config;
