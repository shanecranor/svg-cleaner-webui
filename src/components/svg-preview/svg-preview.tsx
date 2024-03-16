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
    <Group>
      <Stack>
        <img src={`data:image/svg+xml,${encodeURIComponent(cleanSvgCode)}`} />
        <Text>After {(new Blob([cleanSvgCode]).size / 1024).toFixed(2)}kb</Text>
      </Stack>
      <Stack>
        <img src={`data:image/svg+xml,${encodeURIComponent(inputSvgCode)}`} />
        <Text>
          Before {(new Blob([inputSvgCode]).size / 1024).toFixed(2)}kb
        </Text>
      </Stack>
      {/* TODO: Add a diff viewer to highlight any compression artifacts */}
      {/* <Stack>
        <div className="diff">
          <div
            className="img1"
            dangerouslySetInnerHTML={{ __html: cleanSvgCode }}
          />
          <div
            className="img2"
            dangerouslySetInnerHTML={{ __html: inputSvgCode }}
          />
        </div>
        <Text>Diff</Text>
      </Stack> */}
    </Group>
  );
}
