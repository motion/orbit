import BaseComponent from './BaseComponent'

export default class MenuItem extends BaseComponent {
  handleNewProps(keys) {
    console.log('props', keys)
  }
}
