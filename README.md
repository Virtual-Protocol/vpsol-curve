# Virtuals Curve
A Constant Product Curve for the Virtuals launchpad

### Usage
This repo contains both a Cargo and npm package, so you can just import it and use it right away. This is to ensure that students writing Rust code don't have to reimplement the curve logic in Javascript when writing tests, as wasm-bingden provides this for free.

### Build
Although this repo ships an `npm` package, if you make changes to the lib.rs file, you may wish to rebuild. To do this, simply run `make` in the root directory and it will rebuild for you. Builds only configured for MacOS for now.