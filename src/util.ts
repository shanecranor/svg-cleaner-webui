export function getFileSize(text: string) {
  return new Blob([text]).size / 1024;
}

export function downloadSVG(data: string, filename: string) {
  const blob = new Blob([data], { type: "image/svg+xml" });

  // Create an anchor element and trigger a download
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a); // Append the anchor to body
  a.click();
  document.body.removeChild(a); // Remove the anchor from body
  URL.revokeObjectURL(a.href); // Clean up the URL object
}
