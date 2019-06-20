import { AnimationDefinition, BranchDefinition, FrameDefinition } from 'modern-clippy';
import { sleep } from './util/sleep';

function pickRandom(branches: BranchDefinition['branches']) {
	let pick = Math.random() * 100;

	for (const branch of branches) {
		pick -= branch.weight;
		if (pick <= 0) {
			return branch.frameIndex;
		}
	}
}

export function* stepper(animation: AnimationDefinition): IterableIterator<FrameDefinition> {
	let offset = 0;
	let frames = animation.frames;
	let exit = false;

	while (offset < frames.length) {
		let frame = frames[offset];
		exit = !!(yield frame) || exit;

		if (exit && frame.exitBranch) {
			offset = frame.exitBranch;
		} else if (frame.branching) {
			offset = pickRandom(frame.branching.branches) || offset + 1;
		} else {
			offset++;
		}
	}
}

export function animator(animation: AnimationDefinition, frameCallback: (frame: FrameDefinition) => void) {
	const iterator = stepper(animation);
	let exit = false;
	let immediate = false;
	let callImmediate: () => void;
	const done = Promise.race([
		(async () => {
			for (
				let { done, value: frame } = iterator.next(exit);
				!immediate && !done;
				{ done, value: frame } = iterator.next(exit)
			) {
				frameCallback(frame);
				await sleep(frame.duration);
			}
		})(),
		new Promise((result) => {
			callImmediate = result;
		})
	]);

	return {
		done,

		stop() {
			exit = false;
			return done;
		},

		stopImmediately() {
			immediate = true;
			callImmediate();
		}
	};
}
