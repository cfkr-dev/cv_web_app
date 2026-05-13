export function fakeRequest() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, 1000)
  })
}
