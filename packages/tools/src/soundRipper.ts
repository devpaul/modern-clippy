import { get } from 'https';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

async function demapper(text: string, type: string, destination: string) {
	for (var i = 0; i < text.length; i++) {
		i = assertQuote(text, i);
		const name = captureString(text, i);
		i += name.length;
		i = assertQuote(text, i);
		i += captureString(text, i).length;
		i = assertQuote(text, i);
		const data = captureString(text, i);
		i += data.length;
		i = assertQuote(text, i);
		if (name.length === 0) {
			throw new Error('missing filename');
		}
		if (data.length === 0) {
			throw new Error('missing data');
		}
		const filename = join(destination, `${name}.${type}`);
		decode(data, filename);
	}
}

function captureString(text: string, pos: number) {
	let i = pos;
	for (; text[i] !== `'`; i++) {}
	return text.slice(pos, i);
}

function assertQuote(text: string, pos: number) {
	if (text[pos] !== `'`) {
		throw new Error(`parsing error at position ${pos}`);
	}
	return ++pos;
}

function decode(data: string, filename: string) {
	writeFileSync;
	const b = new Buffer(data, 'base64');
	console.log(`Writing ${filename}`);
	writeFileSync(filename, b);
}

function stripWrapping(text: string) {
	const firstBrace = text.indexOf('{');
	const lastBrace = text.lastIndexOf('}');
	return text.slice(firstBrace + 1, lastBrace);
}

async function load(source: string): Promise<string> {
	let result = '';

	return new Promise((resolve, reject) => {
		get(source, (response) => {
			response.on('data', (data) => {
				result += data;
			});

			response.on('error', (error) => {
				reject(error);
			});

			response.on('close', () => {
				resolve(result);
			});
		});
	});
}

async function rip(source: string, type: string, destination: string) {
	mkdirSync(destination, { recursive: true });
	const text = stripWrapping(await load(source));
	demapper(text, type, destination);
}

export { rip as default };
