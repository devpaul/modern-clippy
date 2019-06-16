import { AgentConfiguration } from 'modern-clippy';
import { animator } from '../../common/output/animator';
import { sleep } from '../../common/output/util/sleep';

export class Agent extends HTMLElement {
	protected _agentNode: HTMLElement;
	protected _config!: AgentConfiguration;
	protected _currentAction: string | undefined;

	constructor() {
		super();

		const root = this.attachShadow({ mode: 'open' });
		this._agentNode = document.createElement('div');
		root.appendChild(this._agentNode);
	}

	get actions(): string[] {
		return Object.keys(this._config.animations);
	}

	get current(): string | undefined {
		return this._currentAction;
	}

	load(config: AgentConfiguration) {
		const {
			characterMap,
			frameSize: { width, height }
		} = config;
		this._config = config;
		this._agentNode.style.width = width + 'px';
		this._agentNode.style.height = height + 'px';
		this._agentNode.style.backgroundImage = `url(${characterMap})`;
		this.setFrame(0, 0);
	}

	async play(action: string) {
		try {
			this._currentAction = action;
			const animation = this._config.animations[action];
			if (!animation) {
				throw new Error(`Action ${action} does not exist`);
			}
			for (let frame of animator(animation)) {
				const { images } = frame;
				if (images) {
					const [x, y] = images[0];
					this.setFrame(x, y);
				}
				await sleep(frame.duration);
			}
		} finally {
			this._currentAction = undefined;
		}
	}

	setFrame(x: number, y: number) {
		const { width, height } = this._config.frameSize;
		if (x % width !== 0 || y % height !== 0) {
			console.warn(`frame ${x},${y} is not a multiple of frame size ${width},${height}`);
		}
		this._agentNode.style.backgroundPositionX = x + 'px';
		this._agentNode.style.backgroundPositionY = y + 'px';
	}
}
