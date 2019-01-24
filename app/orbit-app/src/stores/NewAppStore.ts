export class NewAppStore {
  name = ''

  setName = (val: string) => {
    this.name = val
  }

  resetName = () => {
    this.name = ''
  }
}
