import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from '../../../apps/orbit/OrbitIcon'
import { WindowControls } from '../../../views/WindowControls'
import { App } from '@mcro/stores'
import { PeekStore } from '../stores/PeekStore'
// import { ControlButton } from '../../views/ControlButton'

type Props = {
  peekStore?: PeekStore
  title?: React.ReactNode
  date?: React.ReactNode
  subtitle?: React.ReactNode
  permalink?: Function
  icon?: string | React.ReactNode
  theme?: Object
  subhead?: React.ReactNode
  integration?: string
}

const PeekHeaderContain = view(UI.View, {
  zIndex: 100,
})

PeekHeaderContain.theme = ({ theme, position }) => ({
  position: position || 'relative',
  borderBottom: [1, theme.base.borderColor.darken(0.2).desaturate(0.2)],
  background: theme.base.background || '#fff',
})

const TitleBarTitle = props => (
  <UI.Text
    size={1.1}
    fontWeight={700}
    ellipse={1}
    margin={0}
    padding={[3, 80]}
    lineHeight="1.5rem"
    textAlign="center"
    {...props}
  />
)

const TitleBarContain = view({
  flex: 1,
  height: 27,
  maxWidth: '100%',
  position: 'relative',
  zIndex: 1,
})

TitleBarContain.theme = ({ theme }) => ({
  '&:hover': {
    background: theme.hover.background.lighten(0.05),
  },
})

const SubTitleHorizontalSpace = () => <div style={{ width: 12 }} />

const SubTitle = ({ children, date, permalink, icon }) => (
  <UI.Row
    position="relative"
    padding={[0, 12]}
    alignItems="center"
    flex={1}
    height={32}
    zIndex={1}
  >
    {typeof children === 'string' ? <UI.Text>{children}</UI.Text> : children}
    {!!children && !!date && <SubTitleHorizontalSpace />}
    <UI.Text>
      {date ? (
        <>
          {' '}
          <UI.Date>{date}</UI.Date>
        </>
      ) : null}
    </UI.Text>
    {!!permalink &&
      !!icon && (
        <>
          <div style={{ flex: 1 }} />
          <OrbitIcon onClick={permalink} icon={icon} size={20} />
        </>
      )}
  </UI.Row>
)

const TitleBar = ({ children, after, ...props }) => (
  <TitleBarContain {...props}>
    <TitleBarTitle>{children}</TitleBarTitle>
    {after}
  </TitleBarContain>
)

@attachTheme
@view
export class PeekHeaderContent extends React.Component<Props> {
  render() {
    const {
      peekStore,
      title,
      date,
      subtitle,
      permalink,
      icon,
      theme,
      subhead,
      integration,
      ...props
    } = this.props
    return (
      <PeekHeaderContain
        draggable
        onDragStart={peekStore.onDragStart}
        onDrag={peekStore.onDrag}
        onDragEnd={peekStore.onDragEnd}
        theme={theme}
        {...props}
      >
        {/* Nice gradient effect on header */}
        <UI.FullScreen
          background="linear-gradient(rgba(255,255,255,0.055), transparent 44%)"
          pointerEvents="none"
        />
        {/* Fade below the icon */}
        <UI.View
          zIndex={0}
          pointerEvents="none"
          position="absolute"
          top={0}
          right={0}
          bottom={0}
          width={70}
          background={`linear-gradient(to right, transparent, ${theme.base.background.darken(
            0.2,
          )})`}
        />
        {/* <UI.HoverGlow
          width={400}
          height={300}
          opacity={0.1}
          blur={90}
          zIndex={10000}
          resist={50}
        /> */}
        <TitleBar
          after={
            <>
              <UI.Row
                flexFlow="row"
                position="absolute"
                top={0}
                left={6}
                right={0}
                height={27}
                zIndex={10000}
                alignItems="center"
              >
                <WindowControls onClose={App.actions.clearPeek} />
                {!!peekStore.hasHistory && (
                  <UI.Button icon="arrowminleft" circular size={0.8} />
                )}
                <UI.View flex={1} />
                {/* {!!peekStore.tornState && (
                  <ControlButton icon="z" onClick={peekStore.tearPeek} />
                )} */}
              </UI.Row>
            </>
          }
        >
          {title}
        </TitleBar>
        {!!subtitle && (
          <SubTitle date={date} permalink={permalink} icon={icon}>
            {subtitle}
          </SubTitle>
        )}
        {subhead}
      </PeekHeaderContain>
    )
  }
}

export const PeekHeader = view.attach('peekStore')(
  view(props => (
    <UI.Theme theme={props.peekStore.theme || false}>
      <PeekHeaderContent {...props} />
    </UI.Theme>
  )),
)
