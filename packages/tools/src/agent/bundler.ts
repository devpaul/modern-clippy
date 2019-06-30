import { AgentConfiguration, BuildConfiguration, SoundConfiguration, SoundPack } from 'modern-clippy';
import { register } from 'ts-node';
import { join, dirname, basename, extname } from 'path';
import glob from 'glob';
import { readFile, writeFile, mkdirSync, lstatSync } from 'fs';
import { getType } from 'mime';
import { isAgentConfiguration, isBuildConfiguration } from '../../../common/output/cjs/validate';

const baseUrl = process.cwd();

register({
	compilerOptions: {
		baseUrl,
		target: 'es2015'
	}
});

function asyncGlob(value: string, cwd: string) {
	return new Promise<string[]>((resolve, reject) => {
		glob(value, { cwd }, (err, files) => {
			err ? reject(err) : resolve(files);
		});
	});
}

function asyncReadFile(file: string) {
	return new Promise<Buffer>((resolve, reject) => {
		readFile(file, (err, data) => {
			err ? reject(err) : resolve(data);
		});
	});
}

function asyncWriteConfig(target: string, config: AgentConfiguration) {
	return new Promise((resolve, reject) => {
		writeFile(target, JSON.stringify(config), (err) => {
			err ? reject(err) : resolve(config);
		});
	});
}

function isDirectory(path: string) {
	return lstatSync(path).isDirectory();
}

function makeDataUrl(mimeType: string, contents: Buffer) {
	return `data:${mimeType};base64,${contents.toString('base64')}`;
}

export class Bundler {
	private basePath: string;
	constructor(private configFile: string) {
		this.basePath = isDirectory(configFile) ? configFile : dirname(configFile);
	}

	async build() {
		const config = this.load();
		if (!isBuildConfiguration(config)) {
			throw new Error('not a proper build configuration');
		}

		const [soundPack, characterMap] = await Promise.all([
			this.buildSound(config.soundPack),
			this.buildCharacterMap(config.characterMap)
		]);

		return {
			...config,
			soundPack,
			characterMap
		};
	}

	private async buildCharacterMap(config: BuildConfiguration['characterMap']) {
		const path = join(this.basePath, config);
		console.log(`loading character map ${path}`);
		const png = await asyncReadFile(path);
		const mimeType = getType(config) || 'png';
		return makeDataUrl(mimeType, png);
	}

	private async buildSound(config: BuildConfiguration['soundPack']): Promise<AgentConfiguration['soundPack']> {
		const soundPack: SoundConfiguration = {};

		for (const [key, value] of Object.entries(config)) {
			console.log(`loading glob "${value} from ${this.basePath}`);
			const mimeType = getType(key);
			const files = await asyncGlob(value, this.basePath);
			soundPack[key] = await this.processSoundPack(
				files.map((file) => join(this.basePath, file)),
				mimeType || ''
			);
		}
		return soundPack;
	}

	private async processSoundPack(files: string[], mimeType: string): Promise<SoundPack> {
		const pack: SoundPack = {};
		for (let file of files) {
			const name = basename(file, extname(file));
			const contents = await asyncReadFile(file);
			pack[name] = makeDataUrl(mimeType, contents);
		}
		return pack;
	}

	private load(): unknown {
		console.log(`loading config ${this.configFile}`);
		const config = require(this.configFile);
		return config.default || config.config || config;
	}
}

export async function build(
	configFile: string,
	output: string = join(process.cwd(), 'output', basename(configFile, extname(configFile)) + '.json')
) {
	const bundler = new Bundler(configFile);
	const config = await bundler.build();

	if (!isAgentConfiguration(config)) {
		throw new Error('Build failed to create a valid agent configuration');
	}

	mkdirSync(dirname(output), { recursive: true });
	await asyncWriteConfig(output, config);
	console.log(`bundled ${configFile} to ${output}`);
}
