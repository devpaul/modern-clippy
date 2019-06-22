import rover from '../../../agents/output/bundles/rover';
import { Agent } from '../agent';

export class Rover extends Agent {
	constructor() {
		super();

		this.load(rover);
	}
}
