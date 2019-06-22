import { AgentConfiguration, FrameImages } from 'modern-clippy';
import { animator } from '../../common/output/animator';
import audio, { SoundBoard } from '../../common/output/coreAudio';

const agentStyle: string = require('./agent.css').default;
const templateString: string = require('./agent.html');

function throwIfNull<T = any>(value: T | null | undefined, message: string): T {
	if (value == null) {
		throw new Error(message);
	}
	return value;
}

export class Agent extends HTMLElement {
	private _overlays: HTMLElement;
	private _speech: HTMLElement;
	private _config!: AgentConfiguration;
	private _control?: ReturnType<typeof animator> & { action: string };
	private _mute = false;
	private _soundBoard!: SoundBoard;

	static get observedAttributes() {
		return ['bundle', 'mute'];
	}

	constructor() {
		super();

		const shadow = this.attachShadow({ mode: 'open' });

		const template = document.createElement('template');
		template.innerHTML = templateString;
		const root = template.content.cloneNode(true) as HTMLElement;

		this._overlays = throwIfNull(root.querySelector('#overlays'), 'missing overlay container') as HTMLElement;
		this._speech = throwIfNull(root.querySelector('#speech'), 'missing speech container') as HTMLElement;
		throwIfNull(root.querySelector('slot'), 'missing slot').addEventListener('slotchange', (event) => {
			this._onSlotChange(event);
		});

		const style = document.createElement('style');
		style.textContent = agentStyle;

		shadow.appendChild(style);
		shadow.appendChild(root);
	}

	get actions(): string[] {
		return Object.keys(this._config.animations);
	}

	get current(): string | undefined {
		return this._control && this._control.action;
	}

	attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
		switch (name) {
			case 'bundle':
				this.load(newValue);
				break;
			case 'mute':
				this._mute = newValue === 'true';
				break;
		}
	}

	async load(config: AgentConfiguration | string) {
		if (typeof config === 'string') {
			console.log(`loading ${config} bundle`);
			const result = await fetch(config);
			config = (await result.json()) as AgentConfiguration;
		}
		this._config = config;
		while (this._overlays.firstChild) {
			this._overlays.removeChild(this._overlays.firstChild);
		}
		for (let i = config.overlayCount; i > 0; i--) {
			this._createOverlay();
		}
		this._overlays.style.height = config.frameSize.height + 'px';
		this._overlays.style.width = config.frameSize.width + 'px';
		this._soundBoard = await audio.load(config.soundPack);
		this.play('Show');
	}

	play(action: string) {
		const animation = this._config.animations[action];
		if (!animation) {
			throw new Error(`Action ${action} does not exist`);
		}
		this._control && this._control.stopImmediately();
		this.dispatchEvent(
			new CustomEvent('actionStart', {
				detail: { action }
			})
		);
		let time = 0;
		this._control = {
			action,
			...animator(animation, (frame) => {
				const { images = [] } = frame;
				this._setFrames(images);
				for (let i = images.length; i < this._config.overlayCount; i++) {
					this._hideFrame(i);
				}
				if (!this._mute && frame.sound) {
					this._soundBoard.play(String(frame.sound));
				}
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

	stop() {
		this._control && this._control.stop();
	}

	stopImmediately() {
		this._control && this._control.stopImmediately();
	}

	private _createOverlay() {
		const {
			characterMap,
			frameSize: { width, height }
		} = this._config;
		const overlay = document.createElement('div');
		overlay.style.width = width + 'px';
		overlay.style.height = height + 'px';
		overlay.style.backgroundImage = `url(${characterMap})`;
		overlay.style.display = 'none';
		this._overlays.appendChild(overlay);
	}

	private _hideFrame(overlay: number = 0) {
		const node = this._overlays.children[overlay] as HTMLElement;
		node && (node.style.display = 'none');
	}

	private _onSlotChange(event: Event) {
		this._speech.style.visibility = 'visible';
		console.log('slot', event);
	}

	private _setFrame(x: number, y: number, overlay: number = 0) {
		const { width, height } = this._config.frameSize;
		const node = this._overlays.children[overlay] as HTMLElement;
		if (x % width !== 0 || y % height !== 0) {
			console.warn(`frame ${x},${y} is not a multiple of frame size ${width},${height}`);
		}
		if (!node) {
			throw new Error(`Missing overlay ${overlay}`);
		}

		node.style.display = 'block';
		node.style.backgroundPositionX = -x + 'px';
		node.style.backgroundPositionY = -y + 'px';
		node.style.position = 'absolute';
		node.style.top = '0';
		node.style.left = '0';
	}

	private _setFrames(images: FrameImages) {
		if (images) {
			for (let i = 0; i < images.length; i++) {
				const [x, y] = images[i];
				this._setFrame(x, y, i);
			}
		}
	}
}
