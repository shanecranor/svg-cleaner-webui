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
  Modal,
  Title,
} from "@mantine/core";
import init, {
  InitOutput,
  greet,
  clean_svg,
} from "../public/wasm/svg_cleaner_wasm_wrapper.js";
import { useDisclosure, useInputState } from "@mantine/hooks";
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
  const [opened, { open, close }] = useDisclosure(false);
  const errorText$ = useObservable<string>("");

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
      <Modal
        className="error-modal"
        opened={opened}
        onClose={close}
        title="Error parsing SVG"
      >
        <Stack>
          <Text>
            An error occurred while parsing the SVG. Please ensure that the SVG
            code is valid.
          </Text>
          <pre>{errorText$.get()}</pre>
        </Stack>
      </Modal>
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
            try {
              setCleanSvgCode(
                clean_svg(inputSvgCode, JSON.stringify(cleaningOptions$.get()))
              );
            } catch (err) {
              if (typeof err === "string") {
                console.error("An error occurred while cleaning the SVG:", err);
                errorText$.set(err);
              } else {
                console.error("An error occurred while cleaning the SVG:", err);
                errorText$.set("Unknown error");
              }
              open();
            }
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
