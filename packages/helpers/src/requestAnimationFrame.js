// @flow
import global from 'global'

const ogRequestAnimationFrame = global.setInterval

export default function requestAnimationFrame(
  givenCallback: Function,
  duration: number
): number {
  const id = ogRequestAnimationFrame(givenCallback, duration)
  this.subscriptions.add(() => {
    clearInterval(id)
  })
  return id
}
