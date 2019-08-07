export class EventSourceManager {
  source: EventSource
  listeners: any[] = []
  constructor(private url: string) {
    this.start()
  }
  start = () => {
    this.source = new EventSource(this.url)
    this.source.onopen = this.handleOnline
    this.source.onerror = this.handleDisconnect
    this.source.onmessage = this.handleMessage
  }
  private handleOnline() {
    console.debug('[HMR] connected')
  }
  private handleMessage = event => {
    for (var i = 0; i < this.listeners.length; i++) {
      this.listeners[i](event)
    }
  }
  private handleDisconnect() {
    console.log('[HMR] disconnected')
    this.source.close()
    setTimeout(this.start, 1000)
  }
  addMessageListener(fn) {
    this.listeners.push(fn)
  }
  removeListener(fn) {
    const index = this.listeners.findIndex(x => x === fn)
    this.listeners.splice(index, 1)
  }
  removeAllListeners() {
    this.listeners = []
  }
  close() {
    this.source.close()
  }
}
