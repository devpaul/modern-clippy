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
	frameSize: FrameSize;
	/**
	 * The number of frames used to render a character. Usually this is `1` but more complicated
	 * characters can use multiple frames to produce effects
	 */
	overlayCount: number;
	/**
	 * Sounds to use with the agent animations
	 */
	soundPack: SoundConfiguration;
	/**
	 * License information for the bundle. Will be printed to the console when the bundle is loaded.
	 */
	license?: string;
}

export interface FrameSize {
	height: number;
	width: number;
}

export interface BuildConfiguration extends Omit<AgentConfiguration, 'soundPack'> {
	/**
	 * A relative path to the character map image
	 */
	characterMap: string;
	/**
	 * A set of key/globs used by the builder to add audio as data urls
	 */
	soundPack: { [key: string]: string };
}

export interface AnimationMap<S extends SoundPack = SoundPack> {
	[key: string]: AnimationDefinition<S>;
}

export interface SoundConfiguration {
	[key: string]: SoundPack;
}

export interface SoundPack {
	[key: string]: string;
}

export interface AnimationDefinition<S extends SoundPack = SoundPack> {
	frames: FrameDefinition<S>[];
	useExitBranching?: boolean;
}

export interface BranchDefinition {
	branches: { frameIndex: number; weight: number }[];
}

export interface FrameDefinition<S extends SoundPack = SoundPack> {
	branching?: BranchDefinition;
	duration: number;
	images?: FrameImages;
	sound?: string;
	exitBranch?: number;
}

export type FrameImages = [number, number][] | undefined;
