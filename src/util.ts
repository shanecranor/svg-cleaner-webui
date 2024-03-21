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

/*
    This function takes a file and a function to process the file as arguments.
    It reads the file as a string and passes the string to the processing function.
*/
export const loadAndProcessFile = (
  file: File | null,
  processString: (str: string) => void
) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    if (event.target) {
      processString(event.target.result as string);
    }
  };
  reader.readAsText(file);
};

export function calculateFileSizeDecrease(original: string, newString: string) {
  const originalSize = getFileSize(original);
  const newSize = getFileSize(newString);

  if (originalSize === 0) {
    throw new Error(
      "Original file size is 0. Cannot calculate percentage decrease."
    );
  }

  const decrease = originalSize - newSize;
  const percentageDecrease = (decrease / originalSize) * 100;

  return percentageDecrease;
}

export function scrollToId(id: string) {
  const results = document.getElementById(id);
  if (results) {
    results.scrollIntoView({ behavior: "smooth" });
  }
}
