/**
 * The AgentConfiguration contains all configuration options needed to fully describe an agent
 */
export interface AgentConfiguration {
	/**
	 * Describes frames and frame timing used to produce named animations
	 */
	animations: AnimationMap;
	/**
	 * The character map to display the agent
	 */
	characterMap: string;
	/**
	 * The size of the character
	 */
	frameSize: { width: number; height: number };
	/**
	 * The number of frames used to render a character. Usually this is `1` but more complicated
	 * characters can use multiple frames to produce effects
	 */
	overlayCount: number;
	/**
	 * Sounds to use with the agent animations
	 */
	soundPack: SoundConfiguration;
}

export interface AnimationMap {
	[key: string]: AnimationDefinition;
}

export interface SoundConfiguration {
	[key: string]: SoundPack;
}

export interface SoundPack {
	[key: string]: string;
}

export interface AnimationDefinition {
	frames: FrameDefinition[];
	useExitBranching?: boolean;
}

export interface BranchDefinition {
	branches: { frameIndex: number; weight: number }[];
}

export interface FrameDefinition {
	branching?: BranchDefinition;
	duration: number;
	images?: FrameImages;
	sound?: string;
	exitBranch?: number;
}

export type FrameImages = [number, number][] | undefined;
