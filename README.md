# Treenity Starter

Example project using [Treenity](https://github.com/treenity-ai/treenity) engine.

## Quick Start

```bash
git clone --recurse-submodules https://github.com/treenity-ai/starter.git
cd starter
npm install
npm run dev:server
# In another terminal:
npm run dev:front
```

Open http://localhost:3210

## Structure

```
starter/
├── engine/          ← git submodule (treenity engine)
├── data/base/       seed tree (FS mount)
├── root.json        server config
└── package.json     workspaces into engine/*
```

## Adding Your Own Mods

1. Create `mods/` directory
2. Add `"mods/*"` to `workspaces` in `package.json`
3. Create your mod (see [engine docs](https://github.com/treenity-ai/treenity/tree/main/docs))

## License

MIT
