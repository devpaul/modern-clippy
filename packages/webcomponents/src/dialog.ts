import { FrameSize } from 'modern-clippy';

export type RelativePosition = 'left' | 'right' | 'top' | 'bottom';
export interface Space {
	top: number;
	bottom: number;
	left: number;
	right: number;
}
export interface DialogPosition extends Partial<Space> {
	placement: RelativePosition;
}
export type Placement = RelativePosition | 'side' | 'horizontal' | 'vertical';
export interface Dimension {
	width: number;
	height: number;
}

export function isRelativePosition(value: string): value is RelativePosition {
	return value === 'left' || value === 'right' || value === 'top' || value === 'bottom';
}

function calculateAvailableSpace(node: HTMLElement): Space {
	const geometry = node.getBoundingClientRect();
	const screen = { height: window.innerHeight, width: window.innerWidth };

	return {
		top: geometry.top,
		left: geometry.left,
		right: screen.width - geometry.right,
		bottom: screen.height - geometry.bottom
	};
}

export function transformRelativePosition(placement: string[]): RelativePosition[] {
	return placement.reduce<RelativePosition[]>((list, value) => {
		if (isRelativePosition(value)) {
			list.push(value);
		} else if (value === 'vertical') {
			list.push('top');
			list.push('bottom');
		} else if (value === 'horizontal' || value === 'side') {
			list.push('left');
			list.push('right');
		}
		return list;
	}, []);
}

export function choosePosition(
	node: HTMLElement,
	dialogSpace: Dimension,
	preferences: RelativePosition[] = ['left', 'right', 'top', 'bottom']
): RelativePosition | undefined {
	const { height, width } = dialogSpace;
	const space = calculateAvailableSpace(node);
	const position = transformRelativePosition(preferences);
	for (let placement of position) {
		switch (placement) {
			case 'top':
				if (space.top > height) {
					return 'top';
				}
				break;
			case 'bottom':
				if (space.bottom > height) {
					return 'bottom';
				}
				break;
			case 'left':
				if (space.left > width) {
					return 'left';
				}
				break;
			case 'right':
				if (space.right > width) {
					return 'right';
				}
				break;
		}
	}
}

export function getPosition(pos: RelativePosition, agentDimensions: FrameSize): DialogPosition {
	switch (pos) {
		case 'right':
			return calculateRight(agentDimensions);
		case 'bottom':
			return calculateBottom(agentDimensions);
		case 'top':
			return calculateTop(agentDimensions);
		default:
			return calculateLeft(agentDimensions);
	}
}

function calculateLeft(agentDimensions: FrameSize): DialogPosition {
	return { placement: 'left', top: 0, right: Math.floor(0.75 * agentDimensions.width) };
}

function calculateRight(agentDimensions: FrameSize): DialogPosition {
	return { placement: 'right', top: 0, left: Math.floor(0.75 * agentDimensions.width) };
}

function calculateTop(agentDimensions: FrameSize): DialogPosition {
	return { placement: 'top', bottom: Math.floor(0.75 * agentDimensions.height) };
}

function calculateBottom(agentDimensions: FrameSize): DialogPosition {
	return { placement: 'bottom', top: Math.floor(agentDimensions.height) };
}
