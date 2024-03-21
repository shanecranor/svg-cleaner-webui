export interface CleaningOptions {
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

export const DEFAULT_OPTIONS: CleaningOptions = {
  remove_unused_defs: true,
  convert_shapes: true,
  remove_title: true,
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
  resolve_use: true,
  remove_version: true,
  remove_unreferenced_ids: true,
  trim_ids: true,
  remove_text_attributes: true,
  remove_unused_coordinates: true,
  remove_default_attributes: true,
  remove_xmlns_xlink_attribute: true,
  remove_needless_attributes: true,
  remove_gradient_attributes: false,
  join_style_attributes: 2, //0: none, 1:no, 2:some, 3:all
  apply_transform_to_gradients: true,
  apply_transform_to_shapes: true,
  paths_to_relative: true,
  remove_unused_segments: true,
  convert_segments: true,
  append_newline: false, //enable to add a newline at the end of the file
  apply_transform_to_paths: false, //usually disabled by default
  coordinates_precision: 6,
  properties_precision: 6,
  paths_coordinates_precision: 8,
  transforms_precision: 8,
};
