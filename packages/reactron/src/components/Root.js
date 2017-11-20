import BaseComponent from './BaseComponent'
import { app } from 'electron'

export default class Root extends BaseComponent {
  app = app

  render() {
    console.log('root ernder')
    this.children.forEach(child => {
      child.render()
    })
  }
}
