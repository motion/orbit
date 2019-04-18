import { Avatar, ConfigureUIProps, Document, Markdown, Task, Thread } from '@o/ui'
import React from 'react'
import { BitConversation } from '../bit/BitConversation'
import { ConversationItem } from '../bit/BitConversationItem'
import { Readability } from '../bit/Readability'
import { AppMainView } from './AppMainView'

// we could allow custom ones...
export const customItems: ConfigureUIProps['customItems'] = {
  conversation: {
    listItem: ConversationItem,
    item: BitConversation,
  },
  document: {
    listItem: ({ item }) => <Document {...item} />,
    item: ({ item }) => <Document title={item.title} body={item.body} />,
  },
  markdown: {
    listItem: ({ item }) => <Markdown {...item} />,
    item: ({ item }) => <Markdown source={item.body} />,
  },
  text: {
    listItem: ({ item }) => <Readability {...item} />,
    item: ({ item }) => <Readability>{item.body}</Readability>,
  },
  task: {
    listItem: ({ item }) => <Task {...item} />,
    item: ({ item }) => <Task body={item.body} comments={item.data.comments} />,
  },
  thread: {
    listItem: ({ item }) => <Thread {...item} />,
    item: ({ item }) => <Thread body={item.body} messages={item.data.messages} />,
  },
  person: {
    item: ({ item }) => <AppMainView identifier="people" id={item.id} />,
    getListItemProps: item => ({
      iconBefore: true,
      before: item.photo ? (
        <Avatar width={30} height={30} marginRight={6} src={item.photo} />
      ) : null,
    }),
  },
  website: {
    item: ({ item }) => <Document title={item.title} body={item.body} />,
    lsitItem: ({ item }) => <Document title={item.title} body={item.body} />,
  },
}
