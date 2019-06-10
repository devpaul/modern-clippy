import { AgentConfiguration } from '../../agents/output/declarations/src/interfaces';
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
		console.log('loaded');
		this.agentNode.classList.add('width', String(config.frameSize.width));
		this.agentNode.classList.add('height', String(config.frameSize.height));
		this.agentNode.classList.add('background-image', `url(${config.characterMap})`);
		this.agentNode.classList.add('background-x', '0');
		this.agentNode.classList.add('background-y', '0');
	}
}

console.log('init');

customElements.define('modern-clippy', Agent);
