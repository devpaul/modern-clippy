import * as yargs from 'yargs';
import { build } from './agent/bundler';
import { join, resolve } from 'path';

yargs.command(
	'build [source] [target]',
	'build an agent bundle',
	(yargs) => {
		return yargs
			.positional('source', {
				describe: 'path to load a BuildConfiguration source',
				type: 'string',
				require: true
			})
			.positional('target', {
				describe: 'destination json file',
				type: 'string'
			});
	},
	(args) => {
		const source = resolve(join(process.cwd(), args.source || ''));
		const target = args.target && resolve(join(process.cwd(), args.target));
		build(source, target);
	}
).argv;
