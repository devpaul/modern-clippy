import { Agent } from './agent';
import { Clippy } from './clippy';
import { Merlin } from './merlin';
import { Links } from './links';
import { Rover } from './rover';

customElements.define('modern-agent', Agent);
customElements.define('modern-clippy', Clippy);
customElements.define('modern-merlin', Merlin);
customElements.define('modern-links', Links);
customElements.define('modern-rover', Rover);

export default Agent;
export { Agent, Clippy, Merlin, Links, Rover };
