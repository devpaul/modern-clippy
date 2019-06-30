import { AgentConfiguration, BuildConfiguration, SoundConfiguration, SoundPack } from 'modern-clippy';
import { register } from 'ts-node';
import { join, dirname, basename, extname } from 'path';
import glob from 'glob';
import { readFile, writeFile, mkdirSync, lstatSync } from 'fs';

const baseUrl = process.cwd();

register({
	compilerOptions: {
		baseUrl,
		target: 'es2015'
	}
});

function isBuildConfiguration(data: any): data is BuildConfiguration {
	return typeof data === 'object';
}

export function load(file: string): unknown {
	console.log(`loading config ${file}`);
	const config = require(file);
	return config.default || config.config || config;
}

async function buildSound(config: BuildConfiguration, cwd: string): Promise<AgentConfiguration> {
	const soundPack: SoundConfiguration = {};

	for (const [key, value] of Object.entries(config.soundPack)) {
		console.log(`loading glob "${value} from ${cwd}`);
		const files: string[] = await new Promise((resolve, reject) => {
			glob(value, { cwd }, (err, files) => {
				err ? reject(err) : resolve(files);
			});
		});
		soundPack[key] = await processSoundPack(files.map((file) => join(cwd, file)));
	}
	return { ...config, soundPack };
}

async function processSoundPack(files: string[]): Promise<SoundPack> {
	const pack: SoundPack = {};
	for (let file of files) {
		const name = basename(file, extname(file));
		const contents = await new Promise<Buffer>((resolve, reject) => {
			readFile(file, (err, data) => {
				err ? reject(err) : resolve(data);
			});
		});
		pack[name] = contents.toString('base64');
	}
	return pack;
}

export function bundle(configFile: string) {
	const basePath = isDirectory(configFile) ? configFile : dirname(configFile);
	const loaded = load(configFile);
	if (!isBuildConfiguration(loaded)) {
		throw new Error('not a proper build configuration');
	}
	return buildSound(loaded, basePath);
}

function isDirectory(path: string) {
	return lstatSync(path).isDirectory();
}

export async function build(
	configFile: string,
	output: string = join(process.cwd(), 'output', basename(configFile, extname(configFile)) + '.json')
) {
	const config = await bundle(configFile);
	mkdirSync(dirname(output), { recursive: true });
	await new Promise((resolve, reject) => {
		writeFile(output, JSON.stringify(config), (err) => {
			err ? reject(err) : resolve(config);
		});
	});
	console.log(`bundled ${configFile} to ${output}`);
}
