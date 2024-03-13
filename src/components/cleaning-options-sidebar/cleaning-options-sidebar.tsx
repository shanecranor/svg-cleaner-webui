import { Observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
import { Switch, NumberInput, Text } from "@mantine/core";
import { CleaningOptions } from "../../cleaning-options-type";

export const CleaningOptionsSidebar = observer(
  ({ cleaningOptions$ }: { cleaningOptions$: Observable<CleaningOptions> }) => {
    return (
      <div className="cleaning-options">
        {Object.keys(cleaningOptions$.get()).map((key) => {
          const value = cleaningOptions$.get()[key as keyof CleaningOptions];
          let valString = "";
          if (typeof value === "boolean") {
            valString = value ? "true" : "false";
            return (
              <div key={key} className="cleaning-option boolean">
                <Switch
                  className="switch"
                  checked={Boolean(value)}
                  label={`${key}: ${valString}`}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    cleaningOptions$.set((prev) => ({
                      ...prev,
                      [key as keyof CleaningOptions]:
                        event.currentTarget.checked,
                    }));
                  }}
                />
              </div>
            );
          }
          if (typeof value === "number") {
            return (
              <div key={key} className="cleaning-option number">
                <NumberInput
                  className="number-input"
                  style={{ width: "48px" }}
                  size="xs"
                  value={value}
                  aria-label={key}
                  onChange={(value: string | number) => {
                    cleaningOptions$.set((prev) => ({
                      ...prev,
                      [key as keyof CleaningOptions]: value,
                    }));
                  }}
                />
                <Text size="sm">
                  {key}: {value.toString()}
                </Text>
              </div>
            );
          }
          return (
            <div key={key}>
              UNKNOWN TYPE
              {key}: {valString}
            </div>
          );
        })}
      </div>
    );
  }
);
