import { Document, Markdown, Task, Thread } from '@mcro/ui'
import React from 'react'
import { Conversation } from '../bit/BitConversation'
import { ConversationItem } from '../bit/BitConversationItem'
import { Readability } from '../bit/Readability'
import { ListItemPerson } from './ListItemPerson'

export const itemViewsApp = {
  conversation: Conversation,
  document: Document,
  markdown: Markdown,
  text: Readability,
  task: Task,
  thread: Thread,
}

export const itemViewsListItem = {
  conversation: ConversationItem,
  document: ({ item }) => <Document {...item} />,
  markdown: ({ item }) => <Markdown {...item} />,
  text: ({ item }) => <Readability {...item} />,
  task: ({ item }) => <Task {...item} />,
  thread: ({ item }) => <Thread {...item} />,
  person: ListItemPerson,
}
