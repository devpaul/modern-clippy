import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
	mode: 'production',
	entry: {
		agent: './src/index.ts'
		// clippy: './src/agents/clippy.ts',
		// links: './src/agents/links.ts',
		// merlin: './src/agents/merlin.ts',
		// rover: './src/agents/rover.ts'
	},
	devtool: 'inline-source-map',
	output: {
		path: path.resolve(__dirname, 'output')
	},
	optimization: {
		splitChunks: false
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.json']
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
				test: /\.css$/i,
				use: 'raw-loader'
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
