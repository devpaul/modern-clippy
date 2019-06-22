import { Agent } from './agent';
import { Clippy } from './agents/clippy';
import { Merlin } from './agents/merlin';
import { Links } from './agents/links';
import { Rover } from './agents/rover';

customElements.define('modern-agent', Agent);
customElements.define('modern-clippy', Clippy);
customElements.define('modern-merlin', Merlin);
customElements.define('modern-links', Links);
customElements.define('modern-rover', Rover);

export default Agent;
export { Agent, Clippy, Merlin, Links, Rover };
