import { Observable } from "@legendapp/state";
import { Text, Title } from "@mantine/core";
import { calculateFileSizeDecrease } from "../../util";
import "./results.scss";
export function Results({
  cleanSvgCode,
  inputSvgCode,
}: {
  cleanSvgCode: Observable<string>;
  inputSvgCode: Observable<string>;
}) {
  return (
    <div className="c-results">
      <div className="results-text">
        <Text>File size reduced by </Text>
        <Title className="huge">
          {calculateFileSizeDecrease(
            inputSvgCode.get(),
            cleanSvgCode.get()
          ).toFixed(1)}
          %
        </Title>
        <Text>The cleaned SVG is displayed below.</Text>
      </div>
    </div>
  );
}
