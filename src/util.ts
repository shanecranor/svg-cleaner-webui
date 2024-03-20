export function getFileSize(text: string) {
  return new Blob([text]).size / 1024;
}
