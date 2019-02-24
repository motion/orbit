import { Document, Markdown, Task, Thread } from '@mcro/ui'
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

export const itemViewsListItem = {
  conversation: ConversationItem,
  document: Document,
  markdown: Markdown,
  text: Readability,
  task: Task,
  thread: Thread,
}
