import { Agent } from '../agent';
import { isAgentConfiguration } from '../../../common/src/validate';
import * as config from '../../../agents/output/links.json';

export class Links extends Agent {
	constructor() {
		super();

		if (isAgentConfiguration(config)) {
			this.load(config);
		} else {
			throw new Error('invalid bundle');
		}
	}
}

customElements.define('modern-links', Links);
