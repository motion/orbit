import { store } from '@mcro/black'

@store
export default class ContextStore {
  static contextToResult = context => ({
    id: context.url,
    title: context.selection || context.title,
    type: 'context',
    icon: context.application === 'Google Chrome' ? 'social-google' : null,
    image: context.favicon,
  })
}
