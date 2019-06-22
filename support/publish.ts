import * as ghpages from 'gh-pages';
import { join } from 'path';

const baseDir = join(__dirname, '..');
ghpages.publish(
	baseDir,
	{
		push: true,
		src: ['index.html', './packages/webcomponents/output/*']
	},
	() => {
		console.log('Published')!;
	}
);
