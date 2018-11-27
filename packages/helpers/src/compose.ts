export const compose = (...decorators) => <T>(Target: T): T => {
  let res = Target
  for (let i = decorators.length - 1; i > -1; i--) {
    res = decorators[i](res)
  }
  return res
}
