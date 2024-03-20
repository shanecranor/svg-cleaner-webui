import { Button, ButtonProps } from "@mantine/core";
import "./fancy.scss";
import { useEffect } from "react";
export function FancyButton({
  children,
  ...props
}: {
  children: React.ReactNode;
  props?: ButtonProps;
}) {
  useEffect(() => {
    (function setGlowEffectRx() {
      const glowEffects = document.querySelectorAll(".glow-effect");
      glowEffects.forEach((glowEffect) => {
        const glowLines = glowEffect.querySelectorAll("rect");
        const rx = getComputedStyle(glowEffect).borderRadius;
        glowLines.forEach((line) => {
          line.setAttribute("rx", rx);
        });
      });
    })();
  });
  return (
    <Button
      className="fancy-button glow-effect"
      size="xl"
      variant="outline"
      radius="xl"
      color="gray.6"
      {...props}
    >
      {children}
      <svg className="glow-container">
        <rect pathLength="100" stroke-linecap="round" className="glow-blur" />
        <rect pathLength="100" stroke-linecap="round" className="glow-line" />
      </svg>
    </Button>
  );
}
