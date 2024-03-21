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
import {
  calculateFileSizeDecrease,
  downloadSVG,
  getFileSize,
  loadAndProcessFile,
  scrollToId,
} from "./util.js";
import { Results } from "./components/results/results.js";
import { PasteSvgModal } from "./components/paste-svg-modal/paste-svg-modal.js";

const App = observer(() => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [pasteOpened, { open: openPaste, close: closePaste }] =
    useDisclosure(false);

  const [wasmModule, setWasmModule] = useState<InitOutput | null>(null);
  const inputSvg = useObservable<string>("");
  const cleanSvg = useObservable<string>("");
  const cleaningOptions$ = useObservable<CleaningOptions>(DEFAULT_OPTIONS);
  const [errorOpened, { open: openError, close: closeError }] =
    useDisclosure(false);
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

  const handleFileUpload = (file: File | null) => {
    loadAndProcessFile(file, (svgString: string) => {
      inputSvg.set(svgString);
      tryCleanSvg(svgString);
      scrollToId("scroll-results");
    });
  };
  const tryCleanSvg = (fileString?: string) => {
    try {
      const cleaned = clean_svg(
        fileString || inputSvg.get(),
        JSON.stringify(cleaningOptions$.get())
      );
      cleanSvg.set(cleaned);
      downloadSVG(cleaned, "cleaned.svg");
    } catch (err) {
      if (typeof err === "string") {
        console.error("An error occurred while cleaning the SVG:", err);
        errorText$.set(err);
      } else {
        console.error("An error occurred while cleaning the SVG:", err);
        errorText$.set("Unknown error");
      }
      openError();
    }
  };
  return (
    <div className="app">
      <div className="god-rays">
        <img src={gradient} alt="" />
      </div>
      <PasteSvgModal
        opened={pasteOpened}
        submitSvg={(svgString) => {
          inputSvg.set(svgString);
          tryCleanSvg(svgString);
          closePaste();
          scrollToId("scroll-results");
        }}
        close={closePaste}
      />
      <Modal
        className="error-modal"
        opened={errorOpened}
        onClose={closeError}
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
            <FileButton onChange={handleFileUpload}>
              {(props) => <FancyButton {...props}>Select a File</FancyButton>}
            </FileButton>
            <Button
              className="paste-button"
              variant="transparent"
              onClick={openPaste}
            >
              Or Paste SVG
            </Button>
          </div>
        </section>
        {cleanSvg.get() && (
          <section>
            <Results cleanSvgCode={cleanSvg} inputSvgCode={inputSvg} />
            <SvgPreview
              cleanSvgCode={cleanSvg.get()}
              inputSvgCode={inputSvg.get()}
            />
          </section>
        )}
        <div id="scroll-results" />
      </main>
      {/* <aside>
        <CleaningOptionsSidebar cleaningOptions$={cleaningOptions$} />
      </aside> */}
    </div>
  );
});

export default App;
