const setTimeoutP = async (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}
const setImmediateP = async () => {
  return new Promise((resolve) => {
    setImmediate(resolve)
  })
}

export { setTimeoutP, setImmediateP }
