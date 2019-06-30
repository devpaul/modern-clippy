import { Agent } from '../agent';
import { validateBundle } from '../../../common/src/validate';
import * as config from '../../../agents/output/merlin.json';

export class Merlin extends Agent {
	constructor() {
		super();
		if (validateBundle(config)) {
			this.load(config);
		} else {
			throw new Error('invalid bundle');
		}
	}
}

customElements.define('modern-merlin', Merlin);
