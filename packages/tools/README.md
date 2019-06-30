# Running Programmatically

```ts
import clippy from '../agents/src/clippy';
import builder from './builder'

const outputPath = '../output/clippy.json';
builder(clippy, outputPath);
```

# Running CLI (TODO)

## TS => JSON

```
> modern-builder ../agents/src/clippy
```

the input filename will use `../agents/src/clippy.ts` if it exists then `../agents/src/clippy/index.ts`

### Options

* -o : output path (default bundle.json)
* -c : tsconfig to use for the build (default uses internal)
