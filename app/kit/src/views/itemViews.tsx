import { Avatar, Document, Markdown, Task, Thread } from '@o/ui'
import React from 'react'
import { BitConversation } from '../bit/BitConversation'
import { ConversationItem } from '../bit/BitConversationItem'
import { Readability } from '../bit/Readability'
import { AppMainView } from './AppMainView'

export const itemViewsApp = {
  conversation: BitConversation,
  document: ({ item }) => <Document title={item.title} body={item.body} />,
  markdown: ({ item }) => <Markdown source={item.body} />,
  text: ({ item }) => <Readability>{item.body}</Readability>,
  task: ({ item }) => <Task body={item.body} comments={item.data.comments} />,
  thread: ({ item }) => <Thread body={item.body} messages={item.data.messages} />,
  person: ({ item }) => <AppMainView identifier="people" id={item.id} />,
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
      before: item.photo ? (
        <Avatar width={30} height={30} marginRight={6} src={item.photo} />
      ) : null,
    }),
  },
}
