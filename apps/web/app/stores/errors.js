export default class ErrorsStore {
  @observable.ref errors = []

  constructor() {
    this.catchErrors()
  }
}
