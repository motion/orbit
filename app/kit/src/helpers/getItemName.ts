import { ItemType } from '@mcro/models'

const names: { [key in ItemType]: string } = {
  task: 'task',
  thread: 'thread',
  markdown: 'document',
  document: 'document',
  conversation: 'chat',
  text: 'document',
  person: 'person',
  webpage: 'website',
}

export function getItemName(string: ItemType) {
  return names[string] || 'item'
}
