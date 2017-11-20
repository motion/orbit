import { createElement } from '../utils/createElement'
import Renderer from './renderer'
import { validateElement } from '../utils/renderUtils'

export async function render(element) {
  const container = createElement('ROOT')
  validateElement(element)
  await new Promise((resolve, reject) => {
    container.app.once('ready', resolve, reject)
  })
  const node = Renderer.createContainer(container)
  Renderer.updateContainer(element, node, null)
}
