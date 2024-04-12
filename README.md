# Sendary

Sendary is a package builder for monorepo.

> ⚠️ Warning: This package is not yet complete or stable. Do not use in production

## `build`

```json
// sendary.json
{
  // global options
  "build": {
    "externals": true
  }
}
```

```json
// packages/core/build.json
{
  "entries": {
    "./src/index.ts": "./dist/index.js",
    "./src/client.ts": {
      "output": "./dist/client.js",

      "platform": "browser",
      "format": ["commonjs", "esmodule"]
      // cjs => ./dist/client.js
      // esm => ./dist/client.mjs
    }
  }
}
```

```bash
sendary build
```
