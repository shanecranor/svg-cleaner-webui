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
use wasm_bindgen::prelude::*;
use svgcleaner::cleaner::{parse_data, clean_doc, write_buffer};
use svgcleaner::{CleaningOptions, WriteOptions, ParseOptions};
use std::str;

#[wasm_bindgen]
pub fn clean_svg(svg_data: &str) -> Result<String, JsValue> {
    let parse_opt = ParseOptions::default(); // Modify as needed
    let write_opt = WriteOptions::default(); // Modify as needed
    let cleaning_opt = CleaningOptions::default(); // Modify as needed

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


