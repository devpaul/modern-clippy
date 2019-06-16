import { AgentConfiguration } from 'modern-clippy';

export class Agent extends HTMLElement {
	protected _agentNode: HTMLElement;
	protected _config!: AgentConfiguration;

	constructor() {
		super();

		const root = this.attachShadow({ mode: 'open' });
		this._agentNode = document.createElement('div');
		root.appendChild(this._agentNode);
	}

	get actions(): string[] {
		return Object.keys(this._config.animations);
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

	setFrame(x: number, y: number) {
		const { width, height } = this._config.frameSize;
		if (x % width !== 0 || y % height !== 0) {
			console.warn(`frame ${x},${y} is not a multiple of frame size ${width},${height}`);
		}
		this._agentNode.style.backgroundPositionX = String(x);
		this._agentNode.style.backgroundPositionY = String(y);
	}
}
