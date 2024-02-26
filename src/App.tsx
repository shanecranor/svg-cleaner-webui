import { useEffect, useState } from "react";

import "./App.css";
import { Button, Group, TextInput, useMantineColorScheme } from "@mantine/core";
import init, {
  InitOutput,
  greet,
  clean_svg,
} from "../public/wasm/svg_cleaner_wasm_wrapper.js";

function App() {
  const { setColorScheme } = useMantineColorScheme();
  const [wasmModule, setWasmModule] = useState<InitOutput | null>(null);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        const wasm = await init();
        setWasmModule(wasm);
      } catch (err) {
        console.error("An error occurred while loading the WASM module:", err);
      }
    };
    loadWasm();
  }, []);
  return (
    <>
      <Group>
        <Button onClick={() => setColorScheme("light")}>Light</Button>
        <Button onClick={() => setColorScheme("dark")}>Dark</Button>
      </Group>
      <TextInput label="Paste SVG code" placeholder="<svg/>" />
      <Button
        onClick={() => {
          greet("joe");
          console.log(
            clean_svg(
              `<svg><title>svgcleaner</title><circle fill="green" cx="50" cy="50" r="45"/></svg>`
            )
          );
        }}
      >
        Clean SVG
      </Button>
    </>
  );
}
export default App;
