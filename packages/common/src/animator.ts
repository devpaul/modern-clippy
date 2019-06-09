import { AnimationDefinition, BranchDefinition, FrameDefinition } from './interfaces';

function pickRandom(branches: BranchDefinition['branches']) {
	const totalWeight = branches.reduce((weight, branch) => {
		return branch.weight + weight;
	}, 0);
	const pick = Math.random() * totalWeight;

	for (const branch of branches) {
		if (branch.weight >= pick) {
			return branch.frameIndex;
		}
	}
}

export function* animator(animation: AnimationDefinition): IterableIterator<FrameDefinition> {
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
