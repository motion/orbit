import { last } from 'lodash'

class PopoverManager {
  state = new Set<any>()
  closeTm = {}
  closeGroup(group: string, ignore: any) {
    this.state.forEach(item => {
      if (item === ignore) return
      if (item.props.group === group) {
        item.forceClose({ animate: false })
      }
    })
  }
  closeLast() {
    last([...this.state]).forceClose({ animate: false })
  }
  closeAll() {
    this.state.forEach(x => x.forceClose({ animate: false }))
  }
}

export const GlobalPopovers = new PopoverManager()
