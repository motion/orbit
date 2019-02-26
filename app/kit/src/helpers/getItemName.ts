import { AppDefinition } from '../types/AppDefinition'

const names: { [key in AppDefinition['itemType']]: string } = {
  task: 'task',
  thread: 'thread',
  markdown: 'document',
  document: 'document',
  conversation: 'chat',
  text: 'document',
  person: 'person',
  webpage: 'website',
}

export function getItemName(string: AppDefinition['itemType']) {
  return names[string] || 'item'
}
