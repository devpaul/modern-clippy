import { Agent } from '../agent';
import { isAgentConfiguration } from '../../../common/src/validate';
import * as config from '../../../agents/output/clippy.json';

export class Clippy extends Agent {
	constructor() {
		super();

		if (isAgentConfiguration(config)) {
			this.load(config);
		} else {
			throw new Error('invalid bundle');
		}
	}
}

customElements.define('modern-clippy', Clippy);
