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

	load(config: SoundConfiguration) {
		const { mp3, ogg, ...rest } = config;
		if (mp3 && this.canPlay('mp3')) {
			return this.loadSoundPack(mp3);
		} else if (ogg && this.canPlay('ogg')) {
			return this.loadSoundPack(ogg);
		}
		for (let format in rest) {
			if (this.canPlay(format)) {
				return this.loadSoundPack(rest[format]);
			}
		}

		return Promise.reject(new Error('Cannot load audio. No valid type.'));
	}

	private canPlay(format: string) {
		const mimetype = mimeMap.get(format) || format;
		return audioTag.canPlayType(mimetype);
	}

	private loadSoundPack(pack: SoundPack): Promise<SoundBoard> {
		const effects: Effects = {};
		const promises = Object.keys(pack).map((id) => {
			const src = pack[id];
			return new Promise(async (resolve) => {
				const data = await fetch(src);
				const buffer = await data.arrayBuffer();
				const audio = await this.context.decodeAudioData(buffer);
				effects[id] = audio;
				resolve(audio);
			});
		});
		return Promise.all(promises).then(() => {
			return new SoundBoard(this.context, effects);
		});
	}
}

export default new CoreAudio();
