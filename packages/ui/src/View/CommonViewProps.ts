import { ColProps } from '@o/gloss'

export type CommonViewProps = Pick<
  ColProps,
  | 'alignContent'
  | 'alignItems'
  | 'alignSelf'
  | 'animation'
  | 'backdropFilter'
  | 'background'
  | 'backgroundAttachment'
  | 'backgroundBlendMode'
  | 'backgroundClip'
  | 'backgroundColor'
  | 'backgroundImage'
  | 'backgroundOrigin'
  | 'backgroundPosition'
  | 'backgroundPositionX'
  | 'backgroundPositionY'
  | 'backgroundRepeat'
  | 'backgroundSize'
  | 'border'
  | 'borderBottom'
  | 'borderBottomColor'
  | 'borderBottomLeftRadius'
  | 'borderBottomRightRadius'
  | 'borderBottomStyle'
  | 'borderBottomWidth'
  | 'borderCollapse'
  | 'borderColor'
  | 'borderImage'
  | 'borderImageOutset'
  | 'borderImageRepeat'
  | 'borderImageSlice'
  | 'borderImageSource'
  | 'borderImageWidth'
  | 'borderLeft'
  | 'borderLeftColor'
  | 'borderLeftStyle'
  | 'borderLeftWidth'
  | 'borderRadius'
  | 'borderRight'
  | 'borderRightColor'
  | 'borderRightStyle'
  | 'borderRightWidth'
  | 'borderSpacing'
  | 'borderStyle'
  | 'borderTop'
  | 'borderTopColor'
  | 'borderTopLeftRadius'
  | 'borderTopRightRadius'
  | 'borderTopStyle'
  | 'borderTopWidth'
  | 'borderWidth'
  | 'bottom'
  | 'boxShadow'
  | 'boxSizing'
  | 'color'
  | 'content'
  | 'cursor'
  | 'display'
  | 'filter'
  | 'flex'
  | 'flexBasis'
  | 'flexDirection'
  | 'flexFlow'
  | 'flexGrow'
  | 'flexShrink'
  | 'flexWrap'
  | 'font'
  | 'fontFamily'
  | 'fontKerning'
  | 'fontSize'
  | 'fontStyle'
  | 'fontWeight'
  | 'grid'
  | 'gridArea'
  | 'gridAutoColumns'
  | 'gridAutoFlow'
  | 'gridAutoRows'
  | 'gridColumn'
  | 'gridColumnEnd'
  | 'gridColumnGap'
  | 'gridColumnStart'
  | 'gridGap'
  | 'gridRow'
  | 'gridRowEnd'
  | 'gridRowGap'
  | 'gridRowStart'
  | 'gridTemplate'
  | 'gridTemplateAreas'
  | 'gridTemplateColumns'
  | 'gridTemplateRows'
  | 'height'
  | 'imageOrientation'
  | 'imageRendering'
  | 'imageResolution'
  | 'justifyContent'
  | 'left'
  | 'letterSpacing'
  | 'lineBreak'
  | 'lineHeight'
  | 'margin'
  | 'marginBottom'
  | 'marginLeft'
  | 'marginRight'
  | 'marginTop'
  | 'maxHeight'
  | 'maxWidth'
  | 'minHeight'
  | 'minWidth'
  | 'opacity'
  | 'order'
  | 'outline'
  | 'outlineColor'
  | 'outlineOffset'
  | 'outlineStyle'
  | 'outlineWidth'
  | 'overflow'
  | 'overflowWrap'
  | 'overflowX'
  | 'overflowY'
  | 'padding'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'paddingRight'
  | 'paddingTop'
  | 'perspective'
  | 'perspectiveOrigin'
  | 'pointerEvents'
  | 'position'
  | 'right'
  | 'textAlign'
  | 'textDecoration'
  | 'textEmphasis'
  | 'textIndent'
  | 'textOverflow'
  | 'textShadow'
  | 'textTransform'
  | 'top'
  | 'transform'
  | 'transformOrigin'
  | 'transformStyle'
  | 'transition'
  | 'transitionDelay'
  | 'transitionDuration'
  | 'transitionProperty'
  | 'transitionTimingFunction'
  | 'userSelect'
  | 'verticalAlign'
  | 'visibility'
  | 'whiteSpace'
  | 'width'
  | 'willChange'
  | 'wordBreak'
  | 'wordSpacing'
  | 'wordWrap'
  | 'zIndex'
  | 'fill'
  | 'fillOpacity'
  | 'fillRule'
  | 'shapeRendering'
  | 'WebkitAppRegion'
>
