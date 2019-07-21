import { FrameSize } from 'modern-clippy';

export type RelativePosition = 'left' | 'right' | 'top' | 'bottom';
export interface DialogPosition {
	placement: RelativePosition;
	bottom?: number;
	left?: number;
	right?: number;
	top?: number;
}

export function isRelativePosition(value: string): value is RelativePosition {
	return value === 'left' || value === 'right' || value === 'top' || value === 'bottom';
}

function isOptionalNumber(value: any) {
	return value == null || typeof value === 'number';
}

function isDialogPosition(value: any): value is DialogPosition {
	return (
		value &&
		typeof value === 'object' &&
		typeof value.placement === 'string' &&
		isOptionalNumber(value.top) &&
		isOptionalNumber(value.bottom) &&
		isOptionalNumber(value.right) &&
		isOptionalNumber(value.left)
	);
}

export function parsePosition(value: any): DialogPosition {
	if (typeof value === 'string') {
		value = JSON.parse(value);
	}
	if (isDialogPosition(value)) {
		return value;
	}
	throw new Error('Invalid position');
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
	return { placement: 'left', top: 0, left: Math.floor(-0.75 * agentDimensions.width) };
}

function calculateRight(agentDimensions: FrameSize): DialogPosition {
	return { placement: 'right', top: 0, right: Math.floor(-0.75 * agentDimensions.width) };
}

function calculateTop(agentDimensions: FrameSize): DialogPosition {
	return { placement: 'top', top: Math.floor(-0.75 * agentDimensions.height) };
}

function calculateBottom(agentDimensions: FrameSize): DialogPosition {
	return { placement: 'bottom', bottom: Math.floor(-1.1 * agentDimensions.height) };
}
