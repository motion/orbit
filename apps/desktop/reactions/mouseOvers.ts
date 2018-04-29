import { store, react } from '@mcro/black/store'
import { App, Desktop, Electron } from '@mcro/all'

const isMouseOver = (app, mousePosition) => {
  if (!app || !mousePosition) return false
  const { x, y } = mousePosition
  const { position, size } = app
  if (!position || !size) return false
  const withinX = x > position[0] && x < position[0] + size[0]
  const withinY = y > position[1] && y < position[1] + size[1]
  return withinX && withinY
}

@store
export default class MouseOverReactions {
  @react({ log: false })
  setMouseOvers = [
    () => [
      Desktop.mouseState.position,
      App.orbitState.hidden,
      App.orbitState.position,
      App.state.peekTarget,
    ],
    async ([mP, isHidden, orbitPosition, peekTarget], { sleep }) => {
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
        const withinX = Math.abs(oX - mP.x + adjX) < 6
        const withinY = Math.abs(oY - mP.y + adjY) < 15
        if (withinX && withinY) {
          await sleep(250)
          Desktop.sendMessage(App, App.messages.SHOW)
        }
        return
      }
      if (App.orbitState.position) {
        const mouseOver = isMouseOver(App.orbitState, mP)
        // TODO: think we can avoid this check because we do it in Bridge
        if (mouseOver !== Desktop.mouseState.orbitHovered) {
          Desktop.setMouseState({ orbitHovered: false })
        }
      }
      if (!peekTarget) {
        Desktop.setMouseState({ peekHovered: false })
      } else {
        const peekHovered = isMouseOver(Electron.peekState, mP)
        if (peekHovered !== Electron.peekState.mouseOver) {
          Desktop.setMouseState({ peekHovered })
        }
      }
    },
  ]
}
