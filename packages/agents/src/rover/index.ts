import { AgentConfiguration } from 'modern-clippy';
import { animations } from './animations';
import { mp3, characterMap } from './assets';

export const config: AgentConfiguration = {
	animations,
	characterMap,
	frameSize: { width: 80, height: 80 },
	overlayCount: 1,
	soundPack: {
		mp3
	}
};

export default config;
