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
  ActionIcon,
  Box,
} from "@mantine/core";
import {
  IconSunFilled,
  IconMoon,
  IconMoonFilled,
  IconBrightnessDown,
} from "@tabler/icons-react";
import light from "./assets/lights.svg";
import init, {
  InitOutput,
  clean_svg,
} from "../public/wasm/svg_cleaner_wasm_wrapper.js";
import { useDisclosure, useInputState } from "@mantine/hooks";
import { observer, useObservable } from "@legendapp/state/react";
import { CleaningOptionsSidebar } from "./components/cleaning-options-sidebar/cleaning-options-sidebar.js";
import { CleaningOptions, DEFAULT_OPTIONS } from "./cleaning-options-type.js";
import { SvgPreview } from "./components/svg-preview/svg-preview.js";
import { TEMP_SVG } from "./temp-svg.js";
const App = observer(() => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [inputSvgCode, setInputSvgCode] = useInputState(TEMP_SVG);
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
  const tryCleanSvg = () => {
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
  };
  return (
    <div className="app">
      <div className="god-rays">
        <img src={light} alt="" />
      </div>
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
        <div className="header-items">
          <Title order={3} component="div">
            svgzip
          </Title>
          <ActionIcon
            onClick={() => toggleColorScheme()}
            aria-label="toggle color scheme"
            variant="transparent"
            color={colorScheme === "dark" ? "white" : "dark"}
            // size="xl"
          >
            {colorScheme === "dark" ? (
              <IconSunFilled />
            ) : (
              <IconBrightnessDown />
            )}
          </ActionIcon>
        </div>
      </header>
      <main>
        <section className="hero">
          <Title>
            Compress SVGs instantly,<br></br> no upload needed.
          </Title>
          <Text>
            SVG optimizer powered by WebAssembly, Rust, and RazrFalcon's
            (deprecated){" "}
            <a href="https://github.com/RazrFalcon/svgcleaner">
              svg-cleaner repo
            </a>
            . All the files stay on your device and the page will even work
            offline
          </Text>
        </section>
        <section className="compression-zone">
          <TextInput
            label="Paste SVG code"
            placeholder="<svg/>"
            value={inputSvgCode}
            onChange={(event) => setInputSvgCode(event.currentTarget.value)}
          />
          <Button onClick={tryCleanSvg}>Clean SVG</Button>
          <SvgPreview cleanSvgCode={cleanSvgCode} inputSvgCode={inputSvgCode} />
        </section>
      </main>
      <aside>
        <CleaningOptionsSidebar cleaningOptions$={cleaningOptions$} />
      </aside>
    </div>
  );
});

export default App;
