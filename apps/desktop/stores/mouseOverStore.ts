import { store, react } from '@mcro/black/store'
import { App, Desktop } from '@mcro/all'

const isMouseOver = (app, mousePosition) => {
  if (!app || !mousePosition) return false
  const { x, y } = mousePosition
  const { position, size } = app
  if (!position || !size) return false
  const withinX = x > position[0] && x < position[0] + size[0]
  const withinY = y > position[1] && y < position[1] + size[1]
  return withinX && withinY
}

// one place to track mouse position really closely

@store
export default class MouseOverReactions {
  @react({ log: 'state' })
  setMouseOvers = [
    () => [
      Desktop.mouseState.position,
      App.orbitState.hidden,
      App.orbitState.position,
      App.state.peekTarget,
    ],
    async ([mousePos, isHidden, orbitPosition, peekTarget], { sleep }) => {
      if (isHidden) {
        if (Desktop.mouseState.orbitHovered) {
          Desktop.setMouseState({
            orbitHovered: false,
            peekHovered: false,
          })
        }
        // open if hovering indicator
        const [oX, oY] = orbitPosition
        // TODO: Constants.ORBIT_WIDTH
        const adjX = App.orbitOnLeft ? 313 : 17
        const adjY = 36
        const withinX = Math.abs(oX - mousePos.x + adjX) < 6
        const withinY = Math.abs(oY - mousePos.y + adjY) < 15
        if (withinX && withinY) {
          await sleep(250)
          Desktop.sendMessage(App, App.messages.SHOW)
        }
        return
      }
      if (App.orbitState.position) {
        const orbitHovered = isMouseOver(App.orbitState, mousePos)
        // TODO: think we can avoid this check because we do it in Bridge
        if (orbitHovered !== Desktop.mouseState.orbitHovered) {
          Desktop.setMouseState({ orbitHovered })
        }
      }
      if (!peekTarget) {
        Desktop.setMouseState({ peekHovered: false })
      } else {
        const peekHovered = isMouseOver(App.peekState, mousePos)
        if (peekHovered !== App.peekState.mouseOver) {
          Desktop.setMouseState({ peekHovered })
        }
      }
    },
  ]
}
