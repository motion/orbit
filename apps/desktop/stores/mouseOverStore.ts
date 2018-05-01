import { store, react } from '@mcro/black/store'
import { App, Desktop } from '@mcro/all'

const isMouseOver = (bounds, mousePosition) => {
  if (!bounds || !mousePosition) return false
  const { x, y } = mousePosition
  const { position, size } = bounds
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
      App.peekState.target,
      App.orbitState.docked,
    ],
    async ([mousePos, isHidden, orbitPosition, peekTarget], { sleep }) => {
      if (App.orbitState.docked) {
        if (mousePos.x > App.state.screenSize[0] - App.dockedWidth) {
          Desktop.setHoverState({ orbitHovered: true })
        } else {
          Desktop.setHoverState({ orbitHovered: false })
        }
        return
      }
      if (isHidden) {
        if (Desktop.hoverState.orbitHovered || Desktop.hoverState.peekHovered) {
          Desktop.setHoverState({
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
      const orbitHovered =
        orbitPosition && isMouseOver(App.orbitState, mousePos)
      const peekHovered = peekTarget && isMouseOver(App.peekState, mousePos)
      Desktop.setHoverState({ orbitHovered, peekHovered })
    },
  ]
}
