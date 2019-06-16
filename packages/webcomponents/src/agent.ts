import { AgentConfiguration } from 'modern-clippy';
import { animator } from '../../common/output/animator';

export class Agent extends HTMLElement {
	public mute = false; // TODO make this an attribute
	protected _agentNode: HTMLElement;
	protected _config!: AgentConfiguration;
	protected _control?: ReturnType<typeof animator> & { action: string };

	constructor() {
		super();

		const root = this.attachShadow({ mode: 'open' });
		this._agentNode = document.createElement('div');
		root.appendChild(this._agentNode);
	}

	get actions(): string[] {
		return Object.keys(this._config.animations);
	}

	get current(): string | undefined {
		return this._control && this._control.action;
	}

	load(config: AgentConfiguration) {
		const {
			characterMap,
			frameSize: { width, height }
		} = config;
		this._config = config;
		this._agentNode.style.width = width + 'px';
		this._agentNode.style.height = height + 'px';
		this._agentNode.style.backgroundImage = `url(${characterMap})`;
		this.setFrame(0, 0);
	}

	play(action: string) {
		const animation = this._config.animations[action];
		if (!animation) {
			throw new Error(`Action ${action} does not exist`);
		}
		this.dispatchEvent(
			new CustomEvent('actionStart', {
				detail: { action }
			})
		);
		let time = 0;
		this._control = {
			action,
			...animator(animation, (frame) => {
				const { images } = frame;
				if (images) {
					const [x, y] = images[0];
					this.setFrame(x, y);
				}
				// TODO add sound
				this.dispatchEvent(
					new CustomEvent('frame', {
						detail: { action, frame, time }
					})
				);
				time += frame.duration;
			})
		};
		this._control.done.finally(() => {
			this.dispatchEvent(
				new CustomEvent('actionEnd', {
					detail: { action }
				})
			);
			this._control = undefined;
		});
		return this._control;
	}

	playIdle() {
		const idleActions = this.actions.filter((action) => action.substr(0, 4) === 'Idle');
		this.play(idleActions[Math.floor(Math.random() * idleActions.length)]);
	}

	setFrame(x: number, y: number) {
		const { width, height } = this._config.frameSize;
		if (x % width !== 0 || y % height !== 0) {
			console.warn(`frame ${x},${y} is not a multiple of frame size ${width},${height}`);
		}
		this._agentNode.style.backgroundPositionX = x + 'px';
		this._agentNode.style.backgroundPositionY = y + 'px';
	}

	stop() {
		this._control && this._control.stop();
	}

	stopImmediately() {
		this._control && this._control.stopImmediately();
	}
}
