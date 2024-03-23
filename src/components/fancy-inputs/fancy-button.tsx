import { Button, ButtonProps } from "@mantine/core";
import "./fancy.scss";
import { useEffect } from "react";
import { observer, useObservable } from "@legendapp/state/react";
export const FancyButton = observer(
  ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    props?: ButtonProps;
  }) => {
    useEffect(() => {
      (function setGlowEffectRx() {
        const glowEffects = document.querySelectorAll(".glow-effect");
        glowEffects.forEach((glowEffect) => {
          const glowLines = glowEffect.querySelectorAll(".g");
          const rx = getComputedStyle(glowEffect).borderRadius;
          glowLines.forEach((line) => {
            line.setAttribute("rx", rx);
          });
        });
      })();
    });
    const numOutlines = 5;
    const startWidth = 173;
    const startHeight = 60;
    const sizeMultiplier$ = useObservable<number>(90);
    const sizeMultiplier = sizeMultiplier$.get();
    const baseRadius = 999;
    return (
      <Button
        className="fancy-button glow-effect"
        size="xl"
        variant="outline"
        radius="xl"
        color="gray.6"
        onMouseEnter={() => sizeMultiplier$.set(110)}
        onMouseLeave={() => sizeMultiplier$.set(90)}
        {...props}
      >
        {children}
        <svg className="glow-container">
          <rect
            pathLength="100"
            stroke-linecap="round"
            className="glow-blur g"
          />
          <rect
            pathLength="100"
            stroke-linecap="round"
            className="glow-line g"
          />
          {Array.from({ length: numOutlines }, (_, index) => {
            const width = startWidth + sizeMultiplier * (index + 1);
            const height = startHeight + sizeMultiplier * (index + 1);
            // Calculate a proportional radius for each rectangle
            const effectiveRadius = Math.min(baseRadius, width / 2, height / 2);

            return (
              <rect
                key={index}
                className="bg-line"
                style={
                  {
                    "--bg-offset": `${(index + 0.74) * sizeMultiplier}px`,
                    "--index": index,

                    animation: `background-animation linear ${
                      (6 - index) * 5
                    }s infinite`,
                    // strokeDasharray: "25px 25px",
                  } as React.CSSProperties
                }
                pathLength="100"
                // stroke-linecap="round"
                rx={effectiveRadius}
              />
            );
          })}
        </svg>
      </Button>
    );
  }
);
