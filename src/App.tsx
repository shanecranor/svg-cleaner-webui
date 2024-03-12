import { useEffect, useState } from "react";

import "./App.css";
import {
  Button,
  Group,
  Switch,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import init, {
  InitOutput,
  greet,
  clean_svg,
} from "../public/wasm/svg_cleaner_wasm_wrapper.js";
import { useInputState } from "@mantine/hooks";
import { observer, useObservable } from "@legendapp/state/react";

const App = observer(() => {
  const { setColorScheme } = useMantineColorScheme();
  const [inputSvgCode, setInputSvgCode] = useInputState("");
  const [wasmModule, setWasmModule] = useState<InitOutput | null>(null);
  const [cleanSvgCode, setCleanSvgCode] = useState<string>("");
  const cleaningOptions = useObservable({
    remove_unused_defs: false,
    convert_shapes: false,
    remove_title: false,
    remove_desc: true,
    remove_metadata: true,
    remove_dupl_linear_gradients: true,
    remove_dupl_radial_gradients: true,
    remove_dupl_fe_gaussian_blur: true,
    ungroup_groups: true,
    ungroup_defs: true,
    group_by_style: true,
    merge_gradients: true,
    regroup_gradient_stops: true,
    remove_invalid_stops: true,
    remove_invisible_elements: true,
    resolve_use: false,
    remove_version: true,
    remove_unreferenced_ids: true,
    trim_ids: false, //dangerous?
    remove_text_attributes: true,
    remove_unused_coordinates: true,
    remove_default_attributes: true,
    remove_xmlns_xlink_attribute: true,
    remove_needless_attributes: true,
    remove_gradient_attributes: true,
    join_style_attributes: 1,
    apply_transform_to_gradients: true,
    apply_transform_to_shapes: true,
    paths_to_relative: true,
    remove_unused_segments: true,
    convert_segments: true,
    append_newline: true,
    apply_transform_to_paths: true,
    coordinates_precision: 1,
    properties_precision: 1,
    paths_coordinates_precision: 1,
    transforms_precision: 1,
  });

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
      <TextInput
        label="Paste SVG code"
        placeholder="<svg/>"
        value={inputSvgCode}
        onChange={(event) => setInputSvgCode(event.currentTarget.value)}
      />
      <Button
        onClick={() => {
          setCleanSvgCode(
            clean_svg(inputSvgCode, JSON.stringify(cleaningOptions))
          );
        }}
      >
        Clean SVG
      </Button>
      {Object.keys(cleaningOptions.get()).map((key) => {
        const value = cleaningOptions.get()[key as keyof CleaningOptions];
        let valString = "";
        if (typeof value === "boolean") {
          valString = value ? "true" : "false";
          return (
            <div key={key}>
              <Switch
                checked={Boolean(value)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  console.log("fuck");
                  cleaningOptions.set((prev) => ({
                    ...prev,
                    [key as keyof CleaningOptions]: event.currentTarget.checked,
                  }));
                }}
              />
              {key}: {valString}
            </div>
          );
        }
        if (typeof value === "number") {
          valString = value.toString();
        }
        return (
          <div key={key}>
            <Switch
              checked={value}
              onChange={(checked) => {
                cleaningOptions.set({ [key]: checked });
              }}
            />
            {key}: {valString}
          </div>
        );
      })}
      {/* <pre>{cleanSvgCode}</pre> */}

      <div dangerouslySetInnerHTML={{ __html: cleanSvgCode }} />
      <div dangerouslySetInnerHTML={{ __html: inputSvgCode }} />
    </>
  );
});

interface CleaningOptions {
  remove_unused_defs: boolean;
  convert_shapes: boolean;
  remove_title: boolean;
  remove_desc: boolean;
  remove_metadata: boolean;
  remove_dupl_linear_gradients: boolean;
  remove_dupl_radial_gradients: boolean;
  remove_dupl_fe_gaussian_blur: boolean;
  ungroup_groups: boolean;
  ungroup_defs: boolean;
  group_by_style: boolean;
  merge_gradients: boolean;
  regroup_gradient_stops: boolean;
  remove_invalid_stops: boolean;
  remove_invisible_elements: boolean;
  resolve_use: boolean;
  remove_version: boolean;
  remove_unreferenced_ids: boolean;
  trim_ids: boolean;
  remove_text_attributes: boolean;
  remove_unused_coordinates: boolean;
  remove_default_attributes: boolean;
  remove_xmlns_xlink_attribute: boolean;
  remove_needless_attributes: boolean;
  remove_gradient_attributes: boolean;
  join_style_attributes: 0 | 1 | 2;
  apply_transform_to_gradients: boolean;
  apply_transform_to_shapes: boolean;
  paths_to_relative: boolean;
  remove_unused_segments: boolean;
  convert_segments: boolean;
  append_newline: boolean;
  apply_transform_to_paths: boolean;
  coordinates_precision: number;
  properties_precision: number;
  paths_coordinates_precision: number;
  transforms_precision: number;
}

export default App;
