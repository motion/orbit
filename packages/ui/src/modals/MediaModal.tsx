import { Absolute, Row, Theme } from 'gloss'
import React from 'react'

import { Button } from '../buttons/Button'
import { Space } from '../Space'
import { Text } from '../text/Text'
import { View } from '../View/View'
import { Modal, ModalProps } from './Modal'

export function MediaModal({
  title,
  subTitle,
  onChangeOpen,
  closable,
  afterTitle,
  open,
  ...props
}: ModalProps) {
  return (
    <Theme name="dark">
      <Modal chromeless background={theme => theme.background.darken(0.1).alpha(0.8)} open={open}>
        <Row padding={[10, 0]} alignItems="center">
          <View alignItems="center">
            <Text fontWeight={600}>{title}</Text>
            {!!subTitle && (
              <>
                <Space />
                <Text alpha={0.5}>{subTitle}</Text>
              </>
            )}
          </View>

          {!!(afterTitle || closable) && (
            <Absolute top={10} right={10}>
              {afterTitle || null}
              {closable && (
                <Button chromeless icon="cross" size={1.5} onClick={() => onChangeOpen(false)} />
              )}
            </Absolute>
          )}
        </Row>

        <View flex={1} alignItems="center" justifyContent="center" padding={[10, 0]} {...props} />
      </Modal>
    </Theme>
  )
}
