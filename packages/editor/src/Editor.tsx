import { Stack, useTheme, useVisibility } from '@o/ui'
import * as React from 'react'
import { Node, SchemaProperties, Value } from 'slate'
import { Editor as SlateEditor } from 'slate-react'
import styled, { ThemeProvider } from 'styled-components'

import { commands } from './commands'
import { getDataTransferFiles } from './helpers/getDataTransferFiles'
import { createPlugins } from './plugins'
import { PlaceholderPlugin } from './plugins/Placeholder'
import { queries } from './queries'
import { schema } from './schema'
import { Markdown } from './serializer'
import { dark, light } from './theme'
import { Plugin, SearchResult } from './types'

export { schema } from './schema'

const defaultOptions = {}

export type EditorProps = {
  id?: string
  defaultValue: string
  placeholder: string
  pretitle?: string
  plugins: Plugin[]
  autoFocus?: boolean
  readOnly?: boolean
  headingsOffset?: number
  toc?: boolean
  dark?: boolean
  schema?: SchemaProperties
  theme?: Object
  uploadImage?: (file: File) => Promise<string>
  onSave?: (args: { done?: boolean }) => void
  onCancel?: () => void
  onChange: (value: () => string) => void
  onKey?: (keyStr: string) => void
  onFocus?: (e: Event) => void
  onBlur?: (e: Event) => void
  onImageUploadStart?: () => void
  onImageUploadStop?: () => void
  onSearchLink?: (term: string) => Promise<SearchResult[]>
  onClickLink?: (href: string) => void
  onShowToast?: (message: string) => void
  getLinkComponent?: (node: Node) => React.ComponentType<any> | null
  className?: string
  style?: Object
}

type EditorState = {
  editorValue: Value
}

class EditorComponent extends React.PureComponent<EditorProps, EditorState> {
  editor: SlateEditor
  plugins: Plugin[]
  prevSchema: SchemaProperties | null = null
  schema: SchemaProperties | null = null

  get readOnly() {
    return this.props.readOnly
  }

  constructor(props: EditorProps) {
    super(props)

    const builtInPlugins = createPlugins({
      placeholder: props.placeholder,
      getLinkComponent: props.getLinkComponent,
    })

    // in Slate plugins earlier in the stack can opt not to continue
    // to later ones. By adding overrides first we give more control
    this.plugins = [...props.plugins, ...builtInPlugins]

    this.state = {
      editorValue: Markdown.deserialize(props.defaultValue),
    }
  }

  componentDidMount() {
    this.scrollToAnchor()

    if (this.props.readOnly) return
    // if (typeof window !== "undefined") {
    //   window.addEventListener("keydown", this.handleKeyDown);
    // }

    if (this.props.autoFocus) {
      this.focusAtEnd()
    }
  }

  componentDidUpdate(prevProps: EditorProps) {
    if (prevProps.readOnly && !this.props.readOnly && this.props.autoFocus) {
      this.focusAtEnd()
    }
  }

  componentWillUnmount() {
    // if (typeof window !== "undefined") {
    //   window.removeEventListener("keydown", this.handleKeyDown);
    // }
  }

  scrollToAnchor() {
    const { hash } = window.location
    if (!hash) return

    try {
      const element = document.querySelector(hash)
      if (element) element.scrollIntoView({ behavior: 'smooth' })
    } catch (err) {
      // querySelector will throw an error if the hash begins with a number
      // or contains a period. This is protected against now by safeSlugify
      // however previous links may be in the wild.
      console.warn('Attempted to scroll to invalid hash', err)
    }
  }

  setEditorRef = (ref: EditorComponent) => {
    this.editor = ref
  }

  value = () => {
    return Markdown.serialize(this.state.editorValue)
  }

  handleChange = ({ value }: { value: Value }) => {
    this.setState({ editorValue: value }, () => {
      if (this.props.onChange && !this.props.readOnly) {
        this.props.onChange(this.value)
      }
    })
  }

  handleDrop = async (ev: React.DragEvent) => {
    if (this.props.readOnly) return

    // check an image upload callback is defined
    if (!this.editor.props.uploadImage) return

    // check if this event was already handled by the Editor
    if (ev.isDefaultPrevented()) return

    // otherwise we'll handle this
    ev.preventDefault()
    ev.stopPropagation()

    const files = getDataTransferFiles(ev)
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith('image/')) {
        await this.insertImageFile(file)
      }
    }
  }

  insertImageFile = (file: File) => {
    this.editor.insertImageFile(file)
  }

  cancelEvent = (ev: React.DragEvent) => {
    ev.preventDefault()
  }

  onSave(ev: React.KeyboardEvent) {
    const { onSave } = this.props
    if (onSave) {
      ev.preventDefault()
      ev.stopPropagation()
      onSave({ done: false })
    }
  }

  onSaveAndExit(ev: React.KeyboardEvent) {
    const { onSave } = this.props
    if (onSave) {
      ev.preventDefault()
      ev.stopPropagation()
      onSave({ done: true })
    }
  }

  onCancel(ev: React.KeyboardEvent) {
    const { onCancel } = this.props
    if (onCancel) {
      ev.preventDefault()
      ev.stopPropagation()
      onCancel()
    }
  }

  // handleKeyDown = (
  //   ev: React.KeyboardEvent,
  //   _editor: TEditor,
  //   next: Function = () => {}
  // ) => {
  //   if (this.props.readOnly) return next();

  //   switch (ev.key) {
  //     case "s":
  //       if (isModKey(ev)) return this.onSave(ev);
  //       break;
  //     case "Enter":
  //       if (isModKey(ev)) return this.onSaveAndExit(ev);
  //       break;
  //     case "Escape":
  //       if (isModKey(ev)) return this.onCancel(ev);
  //       break;
  //     default:
  //   }

  //   return next();
  // }

  focusAtStart = () => {
    const { editor } = this
    editor.moveToStartOfDocument().focus()
  }

  focusAtEnd = () => {
    const { editor } = this
    editor.moveToEndOfDocument().focus()
  }

  getSchema = () => {
    if (this.prevSchema !== this.props.schema) {
      // @ts-ignore
      this.schema = {
        ...schema,
        ...(this.props.schema || {}),
      }
      this.prevSchema = this.props.schema
    }
    return this.schema
  }

  render() {
    const {
      readOnly,
      pretitle,
      placeholder,
      onSave,
      onChange,
      onCancel,
      uploadImage,
      onSearchLink,
      onClickLink,
      onImageUploadStart,
      onImageUploadStop,
      onShowToast,
      className,
      style,
      dark,
      defaultValue,
      autoFocus,
      plugins,
      theme,
      ...rest
    } = this.props

    return (
      <Stack
        style={style}
        className={className}
        onDrop={this.handleDrop}
        onDragOver={this.cancelEvent}
        onDragEnter={this.cancelEvent}
        padding={[0, 40]}
      >
        <ThemeProvider theme={theme}>
          <SlateEditor
            ref={this.setEditorRef}
            plugins={this.plugins}
            value={this.state.editorValue}
            commands={commands}
            queries={queries}
            placeholder={placeholder}
            schema={this.getSchema()}
            // onKeyDown={this.handleKeyDown}
            onChange={this.handleChange}
            onSave={onSave}
            onSearchLink={onSearchLink}
            onClickLink={onClickLink}
            onImageUploadStart={onImageUploadStart}
            onImageUploadStop={onImageUploadStop}
            onShowToast={onShowToast}
            readOnly={readOnly}
            spellCheck={!readOnly}
            uploadImage={uploadImage}
            pretitle={pretitle}
            options={defaultOptions}
            width="100%"
            {...rest}
          />
        </ThemeProvider>
      </Stack>
    )
  }
}

const StyledEditor = styled(EditorComponent)`
  width: 100%;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 500;
  }

  ul,
  ol {
    margin: 0 0.1em;
    padding-left: 1em;
    ul,
    ol {
      margin: 0.1em;
    }
  }

  p {
    position: relative;
    margin: 0;
  }

  a {
    color: ${props => props.theme.link};
  }

  a:hover {
    text-decoration: ${props => (props.readOnly ? 'underline' : 'none')};
  }

  li p {
    display: inline;
    margin: 0;
  }
  .todoList {
    list-style: none;
    padding-left: 0;
    .todoList {
      padding-left: 1em;
    }
  }

  .todo {
    span:last-child:focus {
      outline: none;
    }
  }

  blockquote {
    border-left: 3px solid ${props => props.theme.quote};
    margin: 0;
    padding-left: 10px;
    font-style: italic;
  }

  b,
  strong {
    font-weight: 600;
  }
`

export function Editor(props: EditorProps) {
  const theme = useTheme()
  const visibility = useVisibility()
  return (
    <StyledEditor
      theme={theme.background.isDark() ? dark : light}
      {...props}
      readOnly={visibility === false ? true : props.readOnly}
    />
  )
}

Editor.defaultProps = {
  defaultValue: '',
  placeholder: 'Write something nice…',
  onImageUploadStart: () => {},
  onImageUploadStop: () => {},
  plugins: [
    PlaceholderPlugin({
      placeholder: 'Start with a title…',
      when: (editor: SlateEditor, node: Node) => {
        if (editor.readOnly) return false
        if (node.object !== 'block') return false
        if (node.type !== 'heading1') return false
        if (node.text !== '') return false
        if (editor.value.document.nodes.first() !== node) return false
        return true
      },
    }),
    PlaceholderPlugin({
      placeholder: '…the rest is your canvas',
      when: (editor: SlateEditor, node: Node) => {
        if (editor.readOnly) return false
        if (node.object !== 'block') return false
        if (node.type !== 'paragraph') return false
        if (node.text !== '') return false
        if (editor.value.document.getDepth(node.key) !== 1) return false
        if (editor.value.document.nodes.size > 2) return false
        return true
      },
    }),
  ],
  tooltip: 'span',
}
