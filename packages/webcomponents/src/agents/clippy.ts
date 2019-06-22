import clippy from '../../../agents/output/bundles/clippy';
import { Agent } from '../agent';

export class Clippy extends Agent {
	constructor() {
		super();
		this.load(clippy);
	}
}
