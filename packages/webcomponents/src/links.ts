import links from '../../agents/output/bundles/links';
import { Agent } from './agent';

export class Links extends Agent {
	constructor() {
		super();

		this.load(links);
	}
}
