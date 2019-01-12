import { createElement } from '../utils/createElement'
import Renderer from './renderer'
import { validateElement } from '../utils/renderUtils'

export async function render(element) {
  const container = createElement('ROOT')
  validateElement(element)
  if (!container.app.isReady()) {
    await new Promise((resolve, reject) => {
      container.app.once('ready', resolve, reject)
    })
  }
  const node = Renderer.createContainer(container)
  console.log('render2', element)
  Renderer.updateContainer(element, node, null)
}
