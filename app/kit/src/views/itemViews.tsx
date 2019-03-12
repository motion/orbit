import { Avatar, Document, Markdown, Task, Thread } from '@o/ui'
import React from 'react'
import { Conversation } from '../bit/BitConversation'
import { ConversationItem } from '../bit/BitConversationItem'
import { Readability } from '../bit/Readability'

export const itemViewsApp = {
  conversation: Conversation,
  document: Document,
  markdown: Markdown,
  text: Readability,
  task: Task,
  thread: Thread,
}

// we could allow custom ones...
export const listItemDecorators = {
  conversation: ConversationItem,
  document: ({ item }) => <Document {...item} />,
  markdown: ({ item }) => <Markdown {...item} />,
  text: ({ item }) => <Readability {...item} />,
  task: ({ item }) => <Task {...item} />,
  thread: ({ item }) => <Thread {...item} />,
  person: {
    getItemProps: item => ({
      iconBefore: true,
      before: <Avatar width={30} height={30} marginRight={6} src={item.photo} />,
    }),
  },
}
