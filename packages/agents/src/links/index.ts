import { AgentConfiguration } from '../interfaces';
import { animations } from './animations';
import { mp3, characterMap } from './assets';

export const config: AgentConfiguration = {
	animations,
	characterMap,
	frameSize: { width: 124, height: 93 },
	overlayCount: 1,
	soundPack: {
		mp3
	}
};

export default config;
