import { isDefined, selectDefined } from '@o/utils'
import { Base } from 'gloss'
import React, { useRef } from 'react'

import { BorderBottom } from './Border'
import { splitCollapseProps, useCollapse } from './Collapsable'
import { DropOverlay, trueFn, useDroppable } from './Draggable'
import { composeRefs } from './helpers/composeRefs'
import { createContextualProps } from './helpers/createContextualProps'
import { Loading } from './progress/Loading'
import { Scale } from './Scale'
import { getSpaceSize, getSpaceSizeNum, Size, Sizes, Space } from './Space'
import { Surface, SurfaceProps } from './Surface'
import { TitleRow, TitleRowSpecificProps } from './TitleRow'
import { Stack, StackProps } from './View/Stack'

// useful for making a higher order component that uses Section internally
// & you dont want to pass *everything* done, this is a good subset
export type SectionSpecificProps = Partial<
  Omit<TitleRowSpecificProps, 'after' | 'below' | 'margin' | 'size' | 'selectable'>
> & {
  /** Add shadow to section */
  elevation?: SurfaceProps['elevation']

  /** Allow scaling just the TitleRow element */
  titleScale?: number

  /** Allow padding just the title element */
  titlePadding?: Sizes

  /** Size the section: title, padding, border radius */
  size?: Size

  /** Set the title size */
  titleSize?: Size

  /** Insert an element before, horizontally */
  beforeTitle?: React.ReactNode

  /** Insert an element after, horizontally */
  afterTitle?: React.ReactNode

  /** Insert an element below the title */
  belowTitle?: React.ReactNode

  /** Adds a border below the title */
  titleBorder?: boolean

  /** Insert an element below the section */
  below?: React.ReactNode

  /** Attach a ref to the inner section div */
  innerRef?: any

  /** Limit the height of the inside of section */
  maxInnerHeight?: number

  /** Set padding of inside of section independently */
  paddingInner?: Sizes

  /** Prevent the title from scrolling when using scrollable property */
  fixedTitle?: boolean

  /** Override the <TitleRow /> entirely */
  titleElement?: React.ReactNode

  /** Allows dropping onto list */
  droppable?: boolean | ((item?: any) => boolean)

  /** Callback on dropped item */
  onDrop?: (item: any, position: [number, number]) => void
}

export type SectionParentProps = Omit<SectionSpecificProps, 'below' | 'innerRef'>

export type SectionProps = Omit<StackProps, 'onSubmit' | 'size'> & SectionSpecificProps

const { useProps, useReset, PassProps } = createContextualProps<SectionProps>()
export const SectionPassProps = PassProps
export const useSectionProps = useProps

// more padded above title
const defaultTitlePaddingAmount = [1.5, 1, 0]

export function Section(direct: SectionProps) {
  // @ts-ignore deep
  const allProps = useProps(direct)
  const [collapseProps, props] = splitCollapseProps(allProps)
  const {
    above,
    title,
    subTitle,
    scrollable,
    children,
    afterTitle,
    bordered,
    belowTitle,
    below,
    flex,
    icon,
    background,
    titleBorder,
    width,
    margin,
    height,
    maxHeight,
    maxInnerHeight,
    maxWidth,
    minHeight,
    beforeTitle,
    innerRef,
    flexDirection,
    space,
    spaceAround,
    paddingInner,
    size = true,
    titleSize = size,
    fixedTitle,
    elevation,
    titleProps,
    backgrounded,
    titleScale,
    borderRadius,
    titleElement,
    titlePadding,
    padding,
    overflow,
    className,
    droppable,
    onDrop,
    nodeRef,
    ...viewProps
  } = props
  const sectionInnerRef = useRef<HTMLElement>(null)

  const isDropping = useDroppable({
    ref: sectionInnerRef,
    acceptsItem: droppable === true ? trueFn : droppable || trueFn,
    onDrop,
  })

  const hasTitle = isDefined(title, afterTitle)
  const padSized = padding === true ? size : padding
  const innerPad = selectDefined(
    paddingInner,
    !!(hasTitle || bordered || titleElement) ? padSized : undefined,
  )
  // this should always be a number were narrowing out array
  const titleSizePx = +getSpaceSize(
    selectDefined(Array.isArray(titlePadding) ? undefined : titlePadding, titleSize),
  )
  const spaceSize = selectDefined(space, size, 'sm')
  const spaceSizePx = getSpaceSizeNum(spaceSize)
  const showTitleAbove = isDefined(fixedTitle, padding, scrollable, innerPad)
  const collapse = useCollapse(collapseProps)

  let titleEl: React.ReactNode = titleElement || null

  const defaultTitlePadding = defaultTitlePaddingAmount.map(x => x * titleSizePx)

  if (!titleElement && hasTitle) {
    const adjustPadProps = !bordered && !titleBorder && !titlePadding && { paddingBottom: 0 }

    const titlePaddingFinal = selectDefined(
      selectDefined(
        titlePadding === false || typeof titlePadding === 'number' || Array.isArray(titlePadding)
          ? titlePadding
          : undefined,
        titlePadding || padding ? defaultTitlePadding : undefined,
        bordered ? selectDefined(padding, true) : undefined,
        titleBorder ? selectDefined(padding, defaultTitlePadding) : undefined,
      ),
    )

    titleEl = (
      <Scale size={titleScale}>
        <TitleRow
          backgrounded={selectDefined(backgrounded, bordered)}
          title={title}
          subTitle={subTitle}
          after={afterTitle}
          above={above}
          before={beforeTitle}
          below={belowTitle || <Space size={defaultTitlePaddingAmount[2] || spaceSizePx} />}
          icon={icon}
          userSelect="none"
          space={spaceSizePx / 2}
          padding={titlePaddingFinal}
          // avoid double pad between content/title padding
          paddingBottom={padding === true && titlePadding === undefined ? 0 : undefined}
          size={selectDefined(titleSize, size)}
          titleProps={titleProps}
          useCollapse={collapse}
          {...adjustPadProps}
        />
      </Scale>
    )

    if (bordered || titleBorder) {
      titleEl = (
        <Base position="relative">
          {titleEl}
          {!!(bordered || titleBorder) && <BorderBottom />}
        </Base>
      )
    }
  }

  return (
    <Surface
      className={`ui-section ${className}`}
      hoverStyle={null}
      activeStyle={null}
      sizeRadius={bordered ? 1 : 0}
      elevation={selectDefined(elevation, bordered ? 1 : 0)}
      borderWidth={bordered ? 1 : 0}
      margin={margin}
      noInnerElement
      // scrollable section wont scroll if no flex, see ManageApps
      flex={selectDefined(flex, !!scrollable ? 1 : undefined)}
      background={background || 'transparent'}
      // in case they change fast
      style={
        {
          height,
          width,
          maxHeight,
          maxWidth,
        } as any
      }
      minHeight={minHeight}
      borderRadius={borderRadius}
      overflow={selectDefined(
        overflow,
        isDefined(scrollable, maxHeight, bordered, borderRadius) ? 'hidden' : undefined,
      )}
      padding={!showTitleAbove ? padSized : false}
      size={size}
      fontSize="inherit"
      lineHeight="inherit"
      nodeRef={nodeRef}
    >
      {showTitleAbove && titleEl}
      {useReset(
        <>
          {!!droppable && <DropOverlay isDropping={isDropping} />}
          <Stack
            maxHeight={maxInnerHeight}
            flex={1}
            nodeRef={composeRefs(sectionInnerRef, innerRef)}
            space={spaceSize}
            spaceAround={spaceAround}
            flexDirection={flexDirection}
            scrollable={scrollable}
            padding={innerPad}
            beforeSpace={!showTitleAbove && titleEl}
            useCollapse={collapse}
            suspense={<Loading />}
            // this helps flex issues
            // see QueryBuilder sidebar when lots of API props come down
            overflow="hidden"
            {...viewProps}
          >
            {children}
          </Stack>
        </>,
      )}
      {below}
    </Surface>
  )
}
