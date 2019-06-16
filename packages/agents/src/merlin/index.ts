import { AgentConfiguration } from 'modern-clippy';
import { animations } from './animations';
import { mp3, characterMap } from './assets';

export const config: AgentConfiguration = {
	animations,
	characterMap,
	frameSize: { width: 128, height: 128 },
	overlayCount: 3,
	soundPack: {
		mp3
	}
};

export default config;
