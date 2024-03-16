import { Group, Stack, Text } from "@mantine/core";
import "./svg-preview.scss";
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
        <Text>After {(new Blob([cleanSvgCode]).size / 1024).toFixed(2)}kb</Text>
      </div>
      <div className="image-container">
        <img
          className="before"
          src={`data:image/svg+xml,${encodeURIComponent(inputSvgCode)}`}
        />
        <Text>
          Before {(new Blob([inputSvgCode]).size / 1024).toFixed(2)}kb
        </Text>
      </div>
      {/* TODO: Add a diff viewer to highlight any compression artifacts */}
      <div className="image-container">
        <div className="diff">
          <img
            className="img1"
            src={`data:image/svg+xml,${encodeURIComponent(inputSvgCode)}`}
          />
          <img
            className="img2"
            src={`data:image/svg+xml,${encodeURIComponent(cleanSvgCode)}`}
          />
        </div>
        <Text>Diff</Text>
      </div>
    </div>
  );
}
