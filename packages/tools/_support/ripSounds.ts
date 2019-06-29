import rip from '../src/soundRipper';
import { join } from 'path';

const sources = [
	'https://raw.githubusercontent.com/smore-inc/clippy.js/master/agents/Clippy/sounds-mp3.js',
	'https://raw.githubusercontent.com/smore-inc/clippy.js/master/agents/Clippy/sounds-ogg.js',
	'https://raw.githubusercontent.com/smore-inc/clippy.js/master/agents/Merlin/sounds-mp3.js',
	'https://raw.githubusercontent.com/smore-inc/clippy.js/master/agents/Merlin/sounds-mp3.js',
	'https://raw.githubusercontent.com/smore-inc/clippy.js/master/agents/Links/sounds-mp3.js',
	'https://raw.githubusercontent.com/smore-inc/clippy.js/master/agents/Links/sounds-ogg.js',
	'https://raw.githubusercontent.com/smore-inc/clippy.js/master/agents/Rover/sounds-mp3.js',
	'https://raw.githubusercontent.com/smore-inc/clippy.js/master/agents/Rover/sounds-ogg.js'
];

for (let source of sources) {
	const type = getType(source);
	const name = getDestination(source);
	const destination = join('output', name);
	rip(source, type, destination);
}

function getType(source: string) {
	return source.slice(source.length - 6, source.length - 3);
}

function getDestination(source: string) {
	const start = source.slice(0, source.length - 14).lastIndexOf('/');
	return source.slice(start + 1, source.length - 14);
}
