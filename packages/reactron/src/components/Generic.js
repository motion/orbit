// @flow
import BaseComponent from './BaseComponent'

export default class GenericElement extends BaseComponent {
  _type: string
  props: Object

  constructor(type: string, props: Object, rootContainer: IonizeContainer) {
    console.log(type, props)
    super(props, rootContainer)
    this._type = type
    this.props = props
  }
}
