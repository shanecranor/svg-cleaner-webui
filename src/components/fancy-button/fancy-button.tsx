import { Button, FileButton } from "@mantine/core";
import "./fancy-button.scss";
import { useEffect, useState } from "react";
export function FancyButton({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<File[] | null>(null);
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
    // <FileButton onChange={setFiles} multiple>
    //   {() => (
    <Button
      className="fancy-button glow-effect"
      size="xl"
      variant="outline"
      radius="xl"
      color="gray.6"
    >
      {children}
      <svg className="glow-container">
        <rect pathLength="100" stroke-linecap="round" className="glow-blur" />
        <rect pathLength="100" stroke-linecap="round" className="glow-line" />
      </svg>
    </Button>
    //   )}
    // </FileButton>
  );
}
