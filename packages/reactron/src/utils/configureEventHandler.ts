export default function configureEventHandler(
  emitter,
  attachedHandlers,
  eventKey,
  rawHandler,
  wrapper,
) {
  const removingHandler = rawHandler === undefined && attachedHandlers[eventKey] !== undefined

  const changingHandler =
    rawHandler !== undefined &&
    attachedHandlers[eventKey] !== undefined &&
    rawHandler !== attachedHandlers[eventKey].rawHandler

  const newHandler = rawHandler !== undefined && attachedHandlers[eventKey] === undefined

  if (removingHandler || changingHandler) {
    const existingHandler = attachedHandlers[eventKey].handler
    emitter.removeListener(eventKey, existingHandler)
    delete attachedHandlers[eventKey]
  }

  if (changingHandler || newHandler) {
    const handler = (...args) => wrapper((...extraArgs) => rawHandler(...extraArgs, ...args))
    attachedHandlers[eventKey] = { rawHandler, handler, emitter }
    emitter.on(eventKey, handler)
  }
}
