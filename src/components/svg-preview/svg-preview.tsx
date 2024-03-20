import { Group, Stack, Text } from "@mantine/core";
import "./svg-preview.scss";
import { getFileSize } from "../../util";
export function SvgPreview({
  cleanSvgCode,
  inputSvgCode,
}: {
  cleanSvgCode: string;
  inputSvgCode: string;
}) {
  return (
    <div className="c-svg-preview">
      <div className="image-container">
        <img
          className="after"
          src={`data:image/svg+xml,${encodeURIComponent(cleanSvgCode)}`}
        />
        <Text>After {getFileSize(cleanSvgCode).toFixed(2)}kb</Text>
      </div>
      {/* TODO: Add a diff viewer to highlight any compression artifacts */}
      {/* <div className="image-container">
        <img
          className="img1"
          src={`data:image/svg+xml,${encodeURIComponent(inputSvgCode)}`}
        />
        <img
          className="img2"
          src={`data:image/svg+xml,${encodeURIComponent(cleanSvgCode)}`}
        />
        <Text>Diff</Text>
      </div> */}
      <div className="image-container">
        <img
          className="before"
          src={`data:image/svg+xml,${encodeURIComponent(inputSvgCode)}`}
        />
        <Text>Before {getFileSize(inputSvgCode).toFixed(2)}kb</Text>
      </div>
    </div>
  );
}
