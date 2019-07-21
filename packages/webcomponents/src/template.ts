const agentStyle: string = require('./agent.css').default;
const templateString: string = require('./agent.html');

function throwIfNull<T = any>(value: T | null | undefined, message: string): T {
	if (value == null) {
		throw new Error(message);
	}
	return value;
}

export function loadTemplate() {
	const template = document.createElement('template');
	template.innerHTML = templateString;
	const root = template.content.cloneNode(true) as HTMLElement;

	throwIfNull(root.querySelector('#overlays'), 'missing overlay container');
	throwIfNull(root.querySelector('#speech'), 'missing speech container');
	throwIfNull(root.querySelector('slot'), 'missing slot');
	return root;
}

export function loadStyles() {
	const style = document.createElement('style');
	style.textContent = agentStyle;
	return style;
}
