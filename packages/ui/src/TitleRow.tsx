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
  unpad?: boolean
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
  unpad,
}: TitleRowProps) {
  const pad = 16
  const sidePad = 10 * sizePadding
  return (
    <View
      position="relative"
      overflow="hidden"
      paddingTop={pad + 2.5 * sizePadding}
      paddingBottom={!!below ? 0 : 10 * sizePadding + 5}
      paddingLeft={sidePad + pad}
      paddingRight={sidePad + pad}
      margin={typeof margin !== 'undefined' ? margin : unpad ? [-pad, -pad, 0] : 0}
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
        {after}
      </Row>
      {below}
      {bordered && <BorderBottom left={10 * sizePadding} right={10 * sizePadding} opacity={0.5} />}
    </View>
  )
}
