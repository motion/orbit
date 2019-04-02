import { Absolute, Row, Theme, View } from '@o/gloss'
import React from 'react'
import { Button } from '../buttons/Button'
import { Space } from '../layout/Space'
import { Text } from '../text/Text'
import { Modal, ModalProps } from './Modal'

export function MediaModal({ title, subTitle, onClose, afterTitle, ...props }: ModalProps) {
  return (
    <Theme name="dark">
      <Modal chromeless background={theme => theme.background.darken(0.1).alpha(0.8)}>
        <Row padding={[10, 0]} alignItems="center">
          <View alignItems="center">
            <Text fontWeight={600}>{title}</Text>
            {!!subTitle && (
              <>
                <Space small />
                <Text alpha={0.5}>{subTitle}</Text>
              </>
            )}
          </View>

          {!!(afterTitle || onClose) && (
            <Absolute top={10} right={10}>
              {afterTitle || null}
              {onClose && (
                <Button chromeless icon="simple-remove" size={1.5} onClick={() => onClose()} />
              )}
            </Absolute>
          )}
        </Row>

        <View flex={1} alignItems="center" justifyContent="center" padding={[10, 0]} {...props} />
      </Modal>
    </Theme>
  )
}
