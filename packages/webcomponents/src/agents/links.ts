import { Agent } from '../agent';
import { validateBundle } from '../../../common/src/validate';
import * as config from '../../../agents/output/rover.json';

export class Links extends Agent {
	constructor() {
		super();

		if (validateBundle(config)) {
			this.load(config);
		} else {
			throw new Error('invalid bundle');
		}
	}
}

customElements.define('modern-links', Links);
