const fs = require('fs');

function decode (data, filename) {
	if (typeof data !== 'string') {
		throw new Error('not string');
	}

	let b = new Buffer(data, 'base64');
	fs.writeFileSync(filename, b);
}

module.exports = function (data, type, destination) {
	if (typeof data !== 'object') {
		throw new Error('not object');
	}

	Object.entries(data).forEach(([key, value]) => {
		const filename = `${destination}/${key}.${type}`;
		decode(value, filename);
	})
}
