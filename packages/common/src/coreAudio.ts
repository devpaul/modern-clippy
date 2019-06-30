import { SoundConfiguration, SoundPack } from 'modern-clippy';
import global from './util/global';

const AudioContext = global.AudioContext || global.webkitAudioContext;

const mimeMap = new Map<string, string>([['mp3', 'audio/mpeg'], ['ogg', 'audio/ogg']]);
const audioTag = document.createElement('audio');

type Effects = { [key: string]: AudioBuffer };

export class SoundBoard {
	constructor(private readonly context: AudioContext, private readonly effects: Effects) {}

	play(name: string) {
		const buffer = this.effects[name];

		if (buffer) {
			if (this.context.state === 'suspended') {
				this.context.resume();
			}
			const source = this.context.createBufferSource();
			source.buffer = buffer;
			source.connect(this.context.destination);
			source.start();
		} else {
			console.warn(`Soundboard missing effect for ${name}`);
		}
	}
}

export class CoreAudio {
	constructor(private readonly context: AudioContext = new AudioContext()) {}

	get suspended() {
		return this.context.state === 'suspended';
	}

	resume() {
		this.context.resume();
	}

	async load(config: SoundConfiguration) {
		const effects: Effects = {};
		Object.keys(config).forEach(async (type) => {
			const pack = config[type];
			if (this.canPlay(type)) {
				console.log('loading ' + type);
				await this.loadSoundPack(effects, pack);
			}
		});
		return new SoundBoard(this.context, effects);
	}

	private async loadSound(src: string) {
		const data = await fetch(src);
		const buffer = await data.arrayBuffer();
		return this.context.decodeAudioData(buffer);
	}

	private canPlay(format: string) {
		const mimetype = mimeMap.get(format) || format;
		return audioTag.canPlayType(mimetype);
	}

	private loadSoundPack(effects: Effects, pack: SoundPack): Promise<any> {
		return Promise.all(
			Object.keys(pack).map(async (id) => {
				if (!effects[id]) {
					try {
						effects[id] = await this.loadSound(pack[id]);
					} catch (e) {
						console.warn(`failed to load audio ${id}`);
					}
				}
			})
		);
	}
}

export default new CoreAudio();
