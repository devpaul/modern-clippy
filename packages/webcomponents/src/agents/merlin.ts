import { Agent } from '../agent';
import { isAgentConfiguration } from '../../../common/src/validate';
import * as config from '../../../agents/output/merlin.json';

export class Merlin extends Agent {
	constructor() {
		super();
		if (isAgentConfiguration(config)) {
			this.load(config);
		} else {
			throw new Error('invalid bundle');
		}
	}
}

customElements.define('modern-merlin', Merlin);
