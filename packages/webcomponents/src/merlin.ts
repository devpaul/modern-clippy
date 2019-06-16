import merlin from '../../agents/output/bundles/merlin';
import { Agent } from './agent';

export class Merlin extends Agent {
	constructor() {
		super();
		this.load(merlin);
	}
}
