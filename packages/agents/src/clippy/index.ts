import { BuildConfiguration } from 'modern-clippy';
import { animations } from './animations';

export const config: BuildConfiguration = {
	animations,
	characterMap: './assets/map.png',
	frameSize: { width: 124, height: 93 },
	overlayCount: 1,
	soundPack: {
		mp3: './assets/*.mp3',
		ogg: './assets/*.ogg'
	},
	license: 'Unlicensed; used under fair use'
};

export default config;
