import root from 'global'

const ogRequestAnimationFrame = root.requestAnimationFrame || root.setInterval

export default function requestAnimationFrame(
  givenCallback: Function,
  duration: number,
): number {
  const id = ogRequestAnimationFrame(givenCallback, duration)
  this.subscriptions.add(() => {
    clearInterval(id)
  })
  return id
}
