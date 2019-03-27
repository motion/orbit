import { Row, View } from '@o/gloss'
import React, { isValidElement } from 'react'
import { BorderBottom } from './Border'
import { Icon } from './Icon'
import { Space } from './layout/Space'
import { SubTitle } from './text/SubTitle'
import { Title } from './text/Title'

export type TitleRowProps = {
  icon?: React.ReactNode
  title: React.ReactNode
  before?: React.ReactNode
  bordered?: boolean
  after?: React.ReactNode
  above?: React.ReactNode
  below?: React.ReactNode
  sizePadding?: number
  backgrounded?: boolean
  subTitle?: React.ReactNode
  margin?: number | number[]
}

export function TitleRow({
  before,
  bordered,
  after,
  margin,
  sizePadding = 1,
  subTitle,
  backgrounded,
  below,
  above,
  icon,
  title,
}: TitleRowProps) {
  const unpad = 20
  const sidePad = 10 * sizePadding
  return (
    <View
      position="relative"
      overflow="hidden"
      paddingTop={unpad + 2.5 * sizePadding}
      paddingBottom={!!below ? 0 : 10 * sizePadding + 5}
      paddingLeft={sidePad + unpad}
      paddingRight={sidePad + unpad}
      margin={typeof margin !== 'undefined' ? margin : [-unpad, -unpad, 10]}
      background={backgrounded ? theme => theme.backgroundAlt : null}
    >
      {above}
      <Row>
        {before && (
          <>
            {before}
            <Space />
          </>
        )}
        {typeof icon === 'string' ? (
          <Icon alignSelf="center" marginRight={16} name={icon} size={20} />
        ) : (
          icon || null
        )}
        <View flex={1}>
          {isValidElement(title) ? (
            title
          ) : (
            <Title marginTop={0} marginBottom={0} ellipse>
              {title}
            </Title>
          )}
          {!!subTitle && (
            <>
              <SubTitle ellipse marginBottom={0}>
                {subTitle}
              </SubTitle>
            </>
          )}
        </View>
        {after && (
          <>
            <div style={{ flex: 1 }} />
            {after}
          </>
        )}
      </Row>
      <Space />
      {below}
      {bordered && <BorderBottom left={10 * sizePadding} right={10 * sizePadding} opacity={0.5} />}
    </View>
  )
}
