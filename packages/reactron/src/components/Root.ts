import { BaseComponent } from './BaseComponent'
import { app } from 'electron'

export class Root extends BaseComponent {
  app = app
}
