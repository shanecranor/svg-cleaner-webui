use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

extern crate svgcleaner;
use svgcleaner::cleaner::{parse_data, clean_doc, write_buffer};
use svgcleaner::{CleaningOptions, WriteOptions, ParseOptions, StyleJoinMode};
use std::str;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct JsCleaningOptions {
    pub remove_unused_defs: bool,
    pub convert_shapes: bool,
    pub remove_title: bool,
    pub remove_desc: bool,
    pub remove_metadata: bool,
    pub remove_dupl_linear_gradients: bool,
    pub remove_dupl_radial_gradients: bool,
    pub remove_dupl_fe_gaussian_blur: bool,
    pub ungroup_groups: bool,
    pub ungroup_defs: bool,
    pub group_by_style: bool,
    pub merge_gradients: bool,
    pub regroup_gradient_stops: bool,
    pub remove_invalid_stops: bool,
    pub remove_invisible_elements: bool,
    pub resolve_use: bool,
    pub remove_version: bool,
    pub remove_unreferenced_ids: bool,
    pub trim_ids: bool,
    pub remove_text_attributes: bool,
    pub remove_unused_coordinates: bool,
    pub remove_default_attributes: bool,
    pub remove_xmlns_xlink_attribute: bool,
    pub remove_needless_attributes: bool,
    pub remove_gradient_attributes: bool,
    pub join_style_attributes: u8,
    pub apply_transform_to_gradients: bool,
    pub apply_transform_to_shapes: bool,
    pub paths_to_relative: bool,
    pub remove_unused_segments: bool,
    pub convert_segments: bool,
    pub append_newline: bool,
    pub apply_transform_to_paths: bool,
    pub coordinates_precision: u8,
    pub properties_precision: u8,
    pub paths_coordinates_precision: u8,
    pub transforms_precision: u8,
}
trait ConvertFromU8 {
    fn convert_from_u8(mode: u8) -> Self;
}

impl ConvertFromU8 for StyleJoinMode {
    fn convert_from_u8(mode: u8) -> Self {
        match mode {
            0 => StyleJoinMode::None,
            1 => StyleJoinMode::All,
            2 => StyleJoinMode::Some,
            _ => StyleJoinMode::None,
        }
    }
}
impl From<JsCleaningOptions> for CleaningOptions {
    fn from(opts: JsCleaningOptions) -> Self {
        CleaningOptions {
            remove_unused_defs: opts.remove_unused_defs,
            convert_shapes: opts.convert_shapes,
            remove_title: opts.remove_title,
            remove_desc: opts.remove_desc,
            remove_metadata: opts.remove_metadata,
            remove_dupl_linear_gradients: opts.remove_dupl_linear_gradients,
            remove_dupl_radial_gradients: opts.remove_dupl_radial_gradients,
            remove_dupl_fe_gaussian_blur: opts.remove_dupl_fe_gaussian_blur,
            ungroup_groups: opts.ungroup_groups,
            ungroup_defs: opts.ungroup_defs,
            group_by_style: opts.group_by_style,
            merge_gradients: opts.merge_gradients,
            regroup_gradient_stops: opts.regroup_gradient_stops,
            remove_invalid_stops: opts.remove_invalid_stops,
            remove_invisible_elements: opts.remove_invisible_elements,
            resolve_use: opts.resolve_use,
            remove_version: opts.remove_version,
            remove_unreferenced_ids: opts.remove_unreferenced_ids,
            trim_ids: opts.trim_ids,
            remove_text_attributes: opts.remove_text_attributes,
            remove_unused_coordinates: opts.remove_unused_coordinates,
            remove_default_attributes: opts.remove_default_attributes,
            remove_xmlns_xlink_attribute: opts.remove_xmlns_xlink_attribute,
            remove_needless_attributes: opts.remove_needless_attributes,
            remove_gradient_attributes: opts.remove_gradient_attributes,
            join_style_attributes:  StyleJoinMode::convert_from_u8(opts.join_style_attributes),
            apply_transform_to_gradients: opts.apply_transform_to_gradients,
            apply_transform_to_shapes: opts.apply_transform_to_shapes,
            paths_to_relative: opts.paths_to_relative,
            remove_unused_segments: opts.remove_unused_segments,
            convert_segments: opts.convert_segments,
            append_newline: opts.append_newline,
            apply_transform_to_paths: opts.apply_transform_to_paths,
            coordinates_precision: opts.coordinates_precision,
            properties_precision: opts.properties_precision,
            paths_coordinates_precision: opts.paths_coordinates_precision,
            transforms_precision: opts.transforms_precision,
        }
    }
}
#[wasm_bindgen]
pub fn clean_svg(svg_data: &str, options_json: &str) -> Result<String, JsValue> {
    let js_options: JsCleaningOptions = serde_json::from_str(options_json).map_err(|e| JsValue::from_str(&e.to_string()))?;
    let cleaning_opt = CleaningOptions::from(js_options);
    let parse_opt = ParseOptions::default(); 
    let write_opt = WriteOptions::default(); 
    // let cleaning_opt = CleaningOptions::default(); 

    // Parse the SVG data
    let mut doc = parse_data(svg_data, &parse_opt)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    // Clean the document
    clean_doc(&mut doc, &cleaning_opt, &write_opt)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    // Write the cleaned SVG to a buffer
    let mut buffer = Vec::new();
    write_buffer(&doc, &write_opt, &mut buffer);

    // Convert buffer to String and return
    String::from_utf8(buffer)
        .map_err(|e| JsValue::from_str(&e.to_string()))
}


