import { useEffect, useState } from "react";

import "./App.scss";
import {
  Button,
  Group,
  NumberInput,
  Switch,
  TextInput,
  Text,
  useMantineColorScheme,
  Stack,
} from "@mantine/core";
import init, {
  InitOutput,
  greet,
  clean_svg,
} from "../public/wasm/svg_cleaner_wasm_wrapper.js";
import { useInputState } from "@mantine/hooks";
import { observer, useObservable } from "@legendapp/state/react";
import { CleaningOptionsSidebar } from "./components/cleaning-options-sidebar/cleaning-options-sidebar.js";
import { CleaningOptions, DEFAULT_OPTIONS } from "./cleaning-options-type.js";
import { SvgPreview } from "./components/svg-preview/svg-preview.js";

const App = observer(() => {
  const { setColorScheme } = useMantineColorScheme();
  const [inputSvgCode, setInputSvgCode] = useInputState("");
  const [wasmModule, setWasmModule] = useState<InitOutput | null>(null);
  const [cleanSvgCode, setCleanSvgCode] = useState<string>("");
  const cleaningOptions$ = useObservable<CleaningOptions>(DEFAULT_OPTIONS);

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
    <div className="app">
      <header>
        <Group>
          SVG Cleaner Web Interface
          <nav>
            <a href="https://github.com/RazrFalcon/svgcleaner">
              svg-cleaner repo
            </a>
          </nav>
          <Button onClick={() => setColorScheme("light")}>Light</Button>
          <Button onClick={() => setColorScheme("dark")}>Dark</Button>
        </Group>
      </header>
      <main>
        <TextInput
          label="Paste SVG code"
          placeholder="<svg/>"
          value={inputSvgCode}
          onChange={(event) => setInputSvgCode(event.currentTarget.value)}
        />
        <Button
          onClick={() => {
            setCleanSvgCode(
              clean_svg(inputSvgCode, JSON.stringify(cleaningOptions$.get()))
            );
          }}
        >
          Clean SVG
        </Button>
        <SvgPreview cleanSvgCode={cleanSvgCode} inputSvgCode={inputSvgCode} />
      </main>
      <aside>
        <CleaningOptionsSidebar cleaningOptions$={cleaningOptions$} />
      </aside>
    </div>
  );
});

export default App;
