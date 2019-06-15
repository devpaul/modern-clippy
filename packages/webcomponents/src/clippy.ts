import { AgentConfiguration } from '../../agents/output/bundles/interfaces';
import clippy from '../../agents/output/bundles/clippy';

class Agent extends HTMLElement {
	private agentNode: HTMLElement;

	constructor() {
		super();

		const root = this.attachShadow({ mode: 'open' });
		this.agentNode = document.createElement('div');
		root.appendChild(this.agentNode);
		this.load(clippy);
	}

	load(config: AgentConfiguration) {
		const {
			characterMap,
			frameSize: { width, height }
		} = config;
		console.log('loaded', clippy);
		this.agentNode.style.width = width + 'px';
		this.agentNode.style.height = height + 'px';
		this.agentNode.style.backgroundImage = `url(${characterMap})`;
		this.setFrame(0, 0);
	}

	setFrame(x: number, y: number) {
		this.agentNode.style.backgroundPositionX = String(x);
		this.agentNode.style.backgroundPositionY = String(y);
	}
}

console.log('init');

customElements.define('modern-clippy', Agent);
