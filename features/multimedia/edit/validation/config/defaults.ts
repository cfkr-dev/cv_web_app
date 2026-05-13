export function createDefaultMultimediaFormValues() {
  return {
    title: "",
    isLink: false,
    isLocalFile: true,
    url: "",
    description: "",
    file: null as File | null,
    fileName: "",
    fileSize: null as number | null,
  }
}
