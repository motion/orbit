export class NewAppStore {
  name = 'New app'
  type = 'search'

  setName = (val: string) => {
    this.name = val
  }

  setType = (val: string) => {
    this.type = val
  }

  reset = () => {
    this.name = 'New app'
    this.type = 'search'
  }
}
