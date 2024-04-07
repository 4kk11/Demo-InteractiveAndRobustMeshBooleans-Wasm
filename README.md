# Demo-InteractiveAndRobustMeshBooleans-Wasm

This GitHub repository demonstrates interactive Boolean operations in the browser by building [InteractiveAndRobustMeshBooleans](https://github.com/gcherchi/InteractiveAndRobustMeshBooleans) with WebAssembly (Wasm).

## Build
```bash
# build with emscripten (requires Docker)
$ cd wasm
$ ./embuild.sh

# change dir
$ cd ../www

# install dependencies
$ yarn install

# run
$ yarn dev
```
