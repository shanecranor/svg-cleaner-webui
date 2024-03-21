import { observer, useObservable } from "@legendapp/state/react";
import { Button, Modal, Stack, Textarea } from "@mantine/core";
import "./paste-svg-modal.scss";
import { TEMP_SVG } from "../../temp-svg";
export const PasteSvgModal = observer(
  ({
    opened,
    submitSvg,
    close,
  }: {
    opened: boolean;
    submitSvg: (svgString: string) => void;
    close: () => void;
  }) => {
    const svgText = useObservable<string>("");
    return (
      <Modal
        className="c-paste-svg-modal"
        size="xl"
        opened={opened}
        onClose={close}
        title="Paste SVG"
        centered
        overlayProps={{
          backgroundOpacity: 0.6,
          blur: 5,
        }}
      >
        <Textarea
          autosize
          minRows={4}
          maxRows={30}
          value={svgText.get()}
          onChange={(event) => svgText.set(event.currentTarget.value)}
        />
        <Button onClick={() => submitSvg(svgText.get())} mt="sm">
          Compress SVG
        </Button>
      </Modal>
    );
  }
);
