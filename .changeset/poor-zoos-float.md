---
'@giphy/react-components': patch
---

react-components: add 'use client' to barrel file (index.ts) in root of package
so tsup doesn't treeshake it out

See: https://github.com/egoist/tsup/issues/835
