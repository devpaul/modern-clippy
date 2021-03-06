import { AgentConfiguration, FrameImages } from 'modern-clippy';

import { animator } from '../../common/output/esm/animator';
import audio, { SoundBoard } from '../../common/output/esm/coreAudio';
import { choosePosition, transformRelativePosition, DialogPosition, getPosition, RelativePosition } from './dialog';
import { loadStyles, loadTemplate } from './template';

function cssPx(pos?: number) {
	return pos != null ? `${pos}px` : null;
}

export class Agent extends HTMLElement {
	private _config!: AgentConfiguration;
	private _control?: ReturnType<typeof animator> & { action: string };
	private _mute = false;
	private _soundBoard!: SoundBoard;

	static get observedAttributes() {
		return ['bundle', 'mute', 'dialog'];
	}

	constructor() {
		super();

		const shadow = this.attachShadow({ mode: 'open' });
		shadow.appendChild(loadStyles());
		shadow.appendChild(loadTemplate());

		const speechSlot = this._speech.querySelector('slot');
		speechSlot &&
			speechSlot.addEventListener('slotchange', (event) => {
				this._onSlotChange(event);
			});
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
			case 'dialog':
				const placement = newValue ? transformRelativePosition(newValue.split(',')) : undefined;
				this._refreshDialogPlacement(placement);
				break;
		}
	}

	async load(config: AgentConfiguration | string) {
		if (typeof config === 'string') {
			console.log(`loading ${config} bundle`);
			const result = await fetch(config);
			config = (await result.json()) as AgentConfiguration;
		}
		if (config.license) {
			console.log('===========================================================');
			console.log('BUNDLE LICENSE');
			console.log(config.license);
			console.log('===========================================================');
		}
		this._config = config;
		while (this._overlays.firstChild) {
			this._overlays.removeChild(this._overlays.firstChild);
		}
		for (let i = config.overlayCount; i > 0; i--) {
			this._createOverlay();
		}
		this._overlays.style.height = cssPx(config.frameSize.height);
		this._overlays.style.width = cssPx(config.frameSize.width);
		this.resetDialogPosition();
		this._soundBoard = await audio.load(config.soundPack);
		this.play('Show');
		this.dispatchEvent(new CustomEvent('loaded'));
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

	resetDialogPosition() {
		const attributeValue = this.getAttribute('dialog');
		const placement = (attributeValue && transformRelativePosition(attributeValue.split(','))) || undefined;
		this._refreshDialogPlacement(placement);
	}

	stop() {
		this._control && this._control.stop();
	}

	stopImmediately() {
		this._control && this._control.stopImmediately();
	}

	private get _overlays(): HTMLElement {
		return this.shadowRoot!.querySelector('#overlays') as HTMLElement;
	}

	private get _speech(): HTMLElement {
		return this.shadowRoot!.querySelector('#speech') as HTMLElement;
	}

	private _createOverlay() {
		const {
			characterMap,
			frameSize: { width, height }
		} = this._config;
		const overlay = document.createElement('div');
		overlay.style.width = cssPx(width);
		overlay.style.height = cssPx(height);
		overlay.style.backgroundImage = `url(${characterMap})`;
		overlay.style.display = 'none';
		this._overlays.appendChild(overlay);
	}

	private _hideFrame(overlay: number = 0) {
		const node = this._overlays.children[overlay] as HTMLElement;
		node && (node.style.display = 'none');
	}

	private _onSlotChange(event: Event) {
		const slot = event.target as HTMLSlotElement;
		this._speech.style.visibility = slot.assignedElements().length ? 'visible' : 'hidden';
	}

	private _refreshDialogPlacement(placement?: RelativePosition[]) {
		const dialog = this._speech;
		const dialogSpace = { height: dialog.clientHeight || 100, width: dialog.clientWidth || 100 };
		const relative =
			placement && placement.length
				? choosePosition(this, dialogSpace, placement) || placement[0]
				: choosePosition(this, dialogSpace) || 'top';
		const position = getPosition(relative, this._config.frameSize);
		this._setDialogPosition(position);
	}

	private _setDialogPosition(position: DialogPosition) {
		const speech = this._speech;
		speech.classList.remove('left', 'right', 'top', 'bottom');
		speech.classList.add(position.placement);
		speech.style.top = cssPx(position.top);
		speech.style.bottom = cssPx(position.bottom);
		speech.style.left = cssPx(position.left);
		speech.style.right = cssPx(position.right);
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
		node.style.backgroundPositionX = cssPx(-x);
		node.style.backgroundPositionY = cssPx(-y);
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
