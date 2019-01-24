export class NewAppStore {
  name = ''
  type = 'search'

  setName = (val: string) => {
    this.name = val
  }

  setType = (val: string) => {
    this.type = val
  }

  reset = () => {
    this.name = ''
    this.type = 'search'
  }
}
