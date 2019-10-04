/**
 * Tree shaking is better i think if we move shared types into a single file
 */
import { Bit } from '../helpers/BitLike'
import { NormalItem } from '../helpers/normalizeItem'
import { IconProps } from '../Icon'
import { ListSeparatorProps } from '../ListSeparator'
import { SurfaceProps } from '../Surface'
import { TextProps } from '../text/Text'
import { SelectableStore } from './SelectableStore'
import { VirtualListItemProps } from './VirtualListItem'

// TODO this can be merged better

export type ListItemViewProps = {
  item?: Bit
  normalizedItem?: Partial<NormalItem>
  shownLimit?: number
  searchTerm?: string
  renderText?: ItemRenderText
  hide?: ListItemHide
  beforeTitle?: React.ReactNode
  oneLine?: boolean
  preventSelect?: boolean
}

export type ItemRenderText = (text: string) => JSX.Element

export type ListItemHide = {
  hideTitle?: boolean
  hideIcon?: boolean
  hideSubtitle?: boolean
  hideBody?: boolean
  hideItemDate?: boolean
  hideDate?: boolean
  hideMeta?: boolean
  hideBorder?: boolean
}

export type HandleSelection = (index: number, event?: any) => any

export type ListItemSimpleProps = Omit<SurfaceProps, 'onClick'> &
  ListItemSpecificProps & {
    onClick?: (e: Event, props: ListItemSimpleProps) => any
  }

export type ListItemProps = ListItemSimpleProps &
  Omit<VirtualListItemProps<Bit>, 'index'> & {
    /** Internally used for selection, can be overridden */
    index?: number

    /** Attach an ID for index view selection, see AppViewProps */
    id?: string

    /** Attach an identifier for index view selection, see AppViewProps */
    identifier?: string

    /** Attach a subType for index view selection, see AppViewProps */
    subType?: string

    /** Show a row of people below the list item */
    people?: Bit[]

    /** Disable automatically showing people when passing in a Bit */
    hidePeople?: boolean

    /** Props for the inner ItemView, when displaying a media item type */
    itemViewProps?: ListItemViewProps

    /** Pass in your own SelectableStore */
    selectableStore?: SelectableStore

    /** Arbitrarily add extra data, makes search and doing things on onSelect callbacks easier */
    extraData?: any

    /** Allow dragging to other targets */
    draggable?: boolean

    /** Specify the item you are dragging */
    draggableItem?: any

    /** Show the full content of the bit, if given, inline */
    showFullContent?: boolean
  }

export type ListItemSpecificProps = ListItemHide & {
  /** Condensed view for list items */
  oneLine?: boolean

  /** Disable/enable selection */
  selectable?: boolean

  /** Adds extra indentation for tree-style view */
  indent?: number

  /** Attach a subId for index view selection, see AppViewProps */
  subId?: string | number

  /** Adds a button before the subtitle */
  location?: React.ReactNode

  /** Adds multi-line text below the Title and Subtitle */
  preview?: React.ReactNode

  /** Adds a title element */
  title?: React.ReactNode

  /** Override the opacity of the text elements below title */
  subTextOpacity?: number

  /** Adds an element vertically above list item */
  above?: React.ReactNode

  /** Adds an element horizontally before list item */
  before?: React.ReactNode

  /** Adds a SubTitle to item */
  subTitle?: React.ReactNode

  /** Adds a date with formatting after list item */
  date?: Date

  /** String or ReactNode to show icon on list item */
  icon?: any

  /** Internal: used for selection */
  index?: number

  /** Adds an element horizontally after title */
  afterTitle?: React.ReactNode

  /** Adds an element horizontally after list item */
  after?: React.ReactNode

  titleProps?: Partial<TextProps>

  /** Icons default to showing inline with the title, this forces them to show before the list item */
  iconBefore?: boolean

  /** Adds extra IconProps to icon elements */
  iconProps?: Partial<IconProps>

  separatorProps?: Partial<ListSeparatorProps>

  /** Add className */
  className?: string

  /** Custom function to parse text */
  renderText?: ItemRenderText

  /** Add custom children below list item */
  children?: React.ReactNode

  /** Disable selection */
  disableSelect?: boolean

  /** Disable filtering this item */
  disableFilter?: boolean

  /** Event used on selection */
  onSelect?: HandleSelection

  /** Event used on double-click or keyboard enter */
  onOpen?: HandleSelection

  /** Add border radius */
  borderRadius?: number

  /** Override selection conditional logic */
  isSelected?: boolean | ((index: number) => boolean)

  /** Whether to make the title push after elements */
  titleFlex?: number

  /** Add extra SubTitle props */
  subTitleProps?: Partial<TextProps>

  /** Event on clicking location element */
  onClickLocation?: (index: number, e?: Event) => any

  /** Text to show in prefixed separator */
  separator?: React.ReactNode

  /** For use with automatic separator generation, when using `<List />` */
  groupName?: string

  /** Will show a delete next to the item automatically and call onDelete */
  deletable?: boolean

  /** Called when deletable is set and user confirms the delete action */
  onDelete?: (item: ListItemSimpleProps) => any

  /** Allows double click on title to edit, calls onEdit when user hits "enter" or clicks away */
  editable?: boolean

  /** Called when `editable` and after editing a title */
  onEdit?: (nextTitle: string) => any

  /** Called when `editable` and cancelled editing a title */
  onCancelEdit?: (nextTitle: string) => any

  /** Called when `editable` and start editing a title */
  onStartEdit?: () => any
}
