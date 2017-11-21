import BaseComponent from './BaseComponent'
import { app } from 'electron'

export default class Root extends BaseComponent {
  app = app
}
