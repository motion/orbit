// @flow
import EventEmitter from 'events'

export default function configureEventHandler(
  emitter: EventEmitter,
  attachedHandlers: { [string]: Function },
  eventKey: string,
  rawHandler: Function,
  wrapper: Function
) {
  const removingHandler =
    rawHandler === undefined && attachedHandlers[eventKey] !== undefined

  const changingHandler =
    rawHandler !== undefined &&
    attachedHandlers[eventKey] !== undefined &&
    rawHandler !== attachedHandlers[eventKey].rawHandler

  const newHandler =
    rawHandler !== undefined && attachedHandlers[eventKey] === undefined

  if (removingHandler || changingHandler) {
    const existingHandler = attachedHandlers[eventKey].handler
    emitter.removeListener(eventKey, existingHandler)
    delete attachedHandlers[eventKey]
  }

  if (changingHandler || newHandler) {
    const handler = () => wrapper(rawHandler)
    attachedHandlers[eventKey] = { rawHandler, handler, emitter }
    emitter.on(eventKey, handler)
  }
}
