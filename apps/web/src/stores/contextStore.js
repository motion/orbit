import { store } from '@mcro/black'

const ws = new WebSocket('ws://localhost:40510')

@store
export default class ContextStore {
  context = null
  ocr = null
  lastScreenChange = null

  willMount() {
    ws.onmessage = ({ data }) => {
      if (data) {
        const { context, ocr, lastScreenChange } = JSON.parse(data)
        this.context = context
        this.ocr = ocr
        this.lastScreenChange = lastScreenChange
      }
    }
  }
}
