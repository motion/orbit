import BaseComponent from './BaseComponent'

export default class SubMenuItem extends BaseComponent {
  handleNewProps(keys) {
    console.log('props', keys)
  }
}
