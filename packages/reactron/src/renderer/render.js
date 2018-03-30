import { createElement } from '../utils/createElement'
import Renderer from './renderer'
import { validateElement } from '../utils/renderUtils'

export async function render(element) {
  const container = createElement('ROOT')
  validateElement(element)
  console.log('start', container.app)
  // await new Promise((resolve, reject) => {
  //   container.app.once('ready', resolve, reject)
  // })
  const node = Renderer.createContainer(container)
  console.log('rendersadsa')
  Renderer.updateContainer(element, node, null)
}
