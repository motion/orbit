import { getGlobalConfig } from '@o/config'
import { Logger } from '@o/logger'
import { resolveObserveMany, MediatorClient } from '@o/mediator'
import { OracleWordsFound, OracleWordsFoundModel, ToggleOrbitMainCommand } from '@o/models'
import { Oracle, OracleMessageHandler, OracleMessages } from '@o/oracle'
import { App, Desktop } from '@o/stores'
import { throttle } from 'lodash'
import Observable from 'zen-observable'

// handles the oracle, which includes OCR and screen watching
const log = new Logger('OracleManager')
const MAC_TOPBAR_HEIGHT = 23

type Point = [number, number]
type BoundsLike = {
  position: Point
  size: Point
  [key: string]: any
}

export class OracleManager {
  private oracle: Oracle

  constructor(private electronMediator: MediatorClient) {
    this.oracle = new Oracle({
      port: getGlobalConfig().ports.ocrBridge,
      onMessage: this.handleMessage,
    })
  }

  async start() {
    await this.oracle.start()
  }

  async stop() {
    await this.oracle.stop()
  }

  handleMessage: OracleMessageHandler = obj => {
    log.info('message', obj)
    switch (obj.message) {
      case OracleMessages.words:
        for (const observer of this.wordObservers) {
          observer.update(obj.value)
        }
        break
      case OracleMessages.trayBounds:
        Desktop.setState({ operatingSystem: { trayBounds: obj.value } })
        break
      case OracleMessages.trayClicked:
        if (obj.value.id === '0') {
          log.info(`Toggle electron main`)
          this.electronMediator.command(ToggleOrbitMainCommand)
        }
        Desktop.setState({ operatingSystem: { trayClicked: { at: Date.now(), ...obj.value } } })
        break
      case OracleMessages.trayHovered:
        Desktop.setState({ operatingSystem: { trayHovered: { at: Date.now(), ...obj.value } } })
        break
      case OracleMessages.mouseMoved:
        this.updateHoverState(obj.value.position)
        break
      default:
        break
    }
  }

  wordObservers = new Set<{
    update: (next: OracleWordsFound[]) => void
    observable: Observable<OracleWordsFound[]>
  }>()
  observeWordsFound() {
    const observable = new Observable<OracleWordsFound[]>(observer => {
      this.wordObservers.add({
        update: (status: OracleWordsFound[]) => {
          observer.next(status)
        },
        observable,
      })
    })
    return observable
  }

  getResolvers() {
    return [
      resolveObserveMany(OracleWordsFoundModel, () => {
        return this.observeWordsFound()
      }),
    ]
  }

  private isMouseOver = (bounds: BoundsLike, mousePosition: Point) => {
    if (!bounds || !mousePosition) {
      return false
    }
    const x = mousePosition[0]
    const y = mousePosition[1] - MAC_TOPBAR_HEIGHT
    const { position, size } = bounds
    if (!position || !size) {
      return false
    }
    const withinX = x > position[0] && x < position[0] + size[0]
    const withinY = y > position[1] && y < position[1] + size[1]
    return withinX && withinY
  }

  lastMousePos: Point = [0, 0]
  private updateHoverState = throttle((mousePos: Point = this.lastMousePos) => {
    // avoid updates
    const { lastMousePos } = this
    if (lastMousePos && lastMousePos[0] === mousePos[0] && lastMousePos[1] === mousePos[1]) {
      return
    }
    this.lastMousePos = mousePos

    // update hover states...
    // // app hovered
    // let appHovered = { ...Desktop.hoverState.appHovered }
    // for (const [index, app] of App.peeksState.entries()) {
    //   const isPeek = index === 0
    //   const hovered = isMouseOver(app, mousePos)
    //   appHovered[app.id] = isPeek ? !!app.target && hovered : hovered
    // }

    // menu hovered
    const { menuState } = App.state.trayState
    const menuHovered = menuState[0] && this.isMouseOver(menuState[0], mousePos)

    Desktop.setState({ hoverState: { menuHovered } })
  }, 35)
}
