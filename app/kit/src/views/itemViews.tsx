import { ConversationItem } from '../media/ConversationItem'
import { Conversation } from './media/Conversation'
import { Document } from './media/Document'
import { Markdown } from './media/Markdown'
import { Readability } from './media/Readability'
import { Task } from './media/Task'
import { Thread } from './media/Thread'

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
