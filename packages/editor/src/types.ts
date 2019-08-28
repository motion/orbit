import * as React from 'react'
import { Editor, Mark as TMark, Node, Value } from 'slate'
import { ReactEditor } from 'slate-react'

export type SlateNodeProps = {
  children: React.ReactNode
  readOnly: boolean
  attributes: Object
  value: Value
  editor: ReactEditor
  node: Node
  parent: Node
  mark: TMark
  isSelected: boolean
}

export type Plugin = {
  onClick?: (event: React.MouseEvent) => void
  onKeyDown?: (event: React.KeyboardEvent, Editor, cb: Function) => void
}

export type SearchResult = {
  title: string
  url: string
}

export type Block =
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'block-quote'
  | 'code'
  | 'code'
  | 'horizontal-rule'
  | 'bulleted-list'
  | 'ordered-list'
  | 'todo-list'
  | 'image'

export type Mark = 'bold' | 'italic' | 'deleted' | 'code' | 'link'

export type HiddenToolbarButtons = {
  marks?: Mark[]
  blocks?: Block[]
}

export type Theme = {
  [key: string]: any

  almostBlack: string
  lightBlack: string
  almostWhite: string
  white: string
  white10: string
  black: string
  black10: string
  primary: string
  greyLight: string
  grey: string
  greyMid: string
  greyDark: string

  fontFamily: string
  fontWeight: number | string
  link: string
  placeholder: string
  textSecondary: string
  textLight: string
  selected: string

  background: string
  text: string

  toolbarBackground: string
  toolbarInput: string
  toolbarItem: string

  blockToolbarBackground: string
  blockToolbarTrigger: string
  blockToolbarTriggerIcon: string
  blockToolbarItem: string

  quote: string
  codeBackground?: string
  codeBorder?: string
  horizontalRule: string

  hiddenToolbarButtons?: HiddenToolbarButtons
}
