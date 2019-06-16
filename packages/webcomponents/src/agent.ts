import { AgentConfiguration } from '../../agents/output/bundles/interfaces';

export class Agent extends HTMLElement {
	protected _agentNode: HTMLElement;

	constructor() {
		super();

		const root = this.attachShadow({ mode: 'open' });
		this._agentNode = document.createElement('div');
		root.appendChild(this._agentNode);
	}

	load(config: AgentConfiguration) {
		const {
			characterMap,
			frameSize: { width, height }
		} = config;
		this._agentNode.style.width = width + 'px';
		this._agentNode.style.height = height + 'px';
		this._agentNode.style.backgroundImage = `url(${characterMap})`;
		this.setFrame(0, 0);
	}

	setFrame(x: number, y: number) {
		this._agentNode.style.backgroundPositionX = String(x);
		this._agentNode.style.backgroundPositionY = String(y);
	}
}
