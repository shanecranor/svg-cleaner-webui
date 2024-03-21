import { useEffect, useState } from "react";

import "./App.scss";
import {
  Button,
  Text,
  useMantineColorScheme,
  Stack,
  Modal,
  Title,
  ActionIcon,
  FileButton,
} from "@mantine/core";
import { IconSunFilled, IconBrightnessDown } from "@tabler/icons-react";
import gradient from "./assets/gradient.svg";
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
import { FancyButton } from "./components/fancy-inputs/fancy-button.js";
import { downloadSVG, getFileSize } from "./util.js";

const App = observer(() => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [inputSvgCode, setInputSvgCode] = useInputState(TEMP_SVG);
  const [wasmModule, setWasmModule] = useState<InitOutput | null>(null);
  const cleanSvgCode = useObservable<string>("");
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
  const loadFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        setInputSvgCode(event.target.result as string);
        tryCleanSvg(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };
  const tryCleanSvg = (fileString?: string) => {
    try {
      const cleaned = clean_svg(
        fileString || inputSvgCode,
        JSON.stringify(cleaningOptions$.get())
      );
      cleanSvgCode.set(cleaned);
      downloadSVG(cleaned, "cleaned.svg");
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
        <img src={gradient} alt="" />
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
            className="color-scheme-toggle"
            onClick={() => toggleColorScheme()}
            aria-label="toggle color scheme"
            variant="transparent"
            color={colorScheme === "dark" ? "white" : "dark"}
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
          <div className="hero-text">
            <Title className="gradient-text">
              Compress SVGs instantly,<br></br> no upload needed.
            </Title>
            <Text>
              SVG optimizer powered by WebAssembly, Rust, and RazrFalcon's
              (deprecated){" "}
              <a href="https://github.com/RazrFalcon/svgcleaner">
                svg-cleaner repo
              </a>
              . All files stay on your device and the page will even work
              offline
            </Text>
          </div>
          <div className="hero-button">
            <FileButton onChange={loadFile}>
              {(props) => <FancyButton {...props}>Select a File</FancyButton>}
            </FileButton>
            <Button className="paste-button" variant="transparent">
              Or Paste SVG
            </Button>
          </div>
        </section>
        <section className="results">
          <div className="results-text">
            <Text>File size reduced by </Text>
            <Title className="huge">
              {(
                ((getFileSize(inputSvgCode) - getFileSize(cleanSvgCode.get())) /
                  getFileSize(inputSvgCode)) *
                100
              ).toFixed(1)}
              %
            </Title>
            <Text>The cleaned SVG is displayed below.</Text>
          </div>
        </section>
        <section className="svg-preview">
          <SvgPreview
            cleanSvgCode={cleanSvgCode.get()}
            inputSvgCode={inputSvgCode}
          />
        </section>
      </main>
      <aside>
        {/* <CleaningOptionsSidebar cleaningOptions$={cleaningOptions$} /> */}
      </aside>
    </div>
  );
});

export default App;
