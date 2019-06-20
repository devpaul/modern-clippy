import { AgentConfiguration, FrameImages } from 'modern-clippy';
import { animator } from '../../common/output/animator';
import audio, { SoundBoard } from '../../common/output/coreAudio';

export class Agent extends HTMLElement {
	private _root: HTMLElement;
	private _config!: AgentConfiguration;
	private _control?: ReturnType<typeof animator> & { action: string };
	private _mute = false;
	private _soundBoard!: SoundBoard;

	static get observedAttributes() {
		return ['mute'];
	}

	constructor() {
		super();

		const shadow = this.attachShadow({ mode: 'open' });
		this._root = document.createElement('div');
		this._root.style.position = 'relative';
		shadow.appendChild(this._root);
	}

	get actions(): string[] {
		return Object.keys(this._config.animations);
	}

	get current(): string | undefined {
		return this._control && this._control.action;
	}

	attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
		switch (name) {
			case 'mute':
				this._mute = newValue === 'true';
				break;
		}
	}

	async load(config: AgentConfiguration) {
		this._config = config;
		while (this._root.firstChild) {
			this._root.removeChild(this._root.firstChild);
		}
		for (let i = config.overlayCount; i > 0; i--) {
			this._createOverlay();
		}
		this._root.style.height = config.frameSize.height + 'px';
		this._root.style.width = config.frameSize.width + 'px';
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
		this._root.appendChild(overlay);
	}

	private _hideFrame(overlay: number = 0) {
		const node = this._root.children[overlay] as HTMLElement;
		node && (node.style.display = 'none');
	}

	private _setFrame(x: number, y: number, overlay: number = 0) {
		const { width, height } = this._config.frameSize;
		const node = this._root.children[overlay] as HTMLElement;
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
