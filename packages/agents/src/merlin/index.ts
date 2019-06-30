import { BuildConfiguration } from 'modern-clippy';
import { animations } from './animations';

export const config: BuildConfiguration = {
	animations,
	characterMap: './assets/map.png',
	frameSize: { width: 128, height: 128 },
	overlayCount: 3,
	soundPack: {
		mp3: './assets/*.mp3'
	},
	license: 'Unlicensed; used under fair use'
};

export default config;
