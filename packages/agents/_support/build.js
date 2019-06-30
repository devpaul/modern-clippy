const build = require('../../tools').build;
const path = require('path');
const basePath = path.join(__dirname, '..', 'src');

Promise.all([
	'clippy',
	'merlin',
	'links',
	'rover'
].map(name => path.join(basePath, name)).map(path => build(path)));
