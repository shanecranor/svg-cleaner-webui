# SVG Cleaner WebUI

A simple web interface for using the SVG Cleaner rust library. Mostly a proof of concept to learn more about rust and web assembly.

Try it out here: [https://svgzip.com](https://svgzip.com)

To test locally, run `npm install` and `npm run dev`.

If you want to modify the rust code, cd into the `wasm` directory and then run `wasm-pack build --target web` 

Copy the files from pkg to `public/wasm/` to update the WASM binaries.
