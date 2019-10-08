import { Absolute, Theme, useTheme } from 'gloss'
import React, { memo } from 'react'

import { Button } from '../buttons/Button'
import { Scale } from '../Scale'
import { getSize } from '../Sizes'
import { Space } from '../Space'
import { Text } from '../text/Text'
import { Stack } from '../View/Stack'
import { View } from '../View/View'
import { Modal, ModalProps } from './Modal'

export const MediaModal = memo(
  ({ title, subTitle, onChangeOpen, closable, afterTitle, open, size, ...props }: ModalProps) => {
    const theme = useTheme()
    const modalBackground = theme.overlayBackground || theme.background.darken(0.1).setAlpha(0.8)
    return (
      <Scale size={getSize(size)}>
        <Theme name="dark">
          <Modal chromeless background={modalBackground} open={open}>
            <View flexDirection="row" padding={[10, 0]} alignItems="center">
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
                    <Button
                      chromeless
                      icon="cross"
                      size={1.5}
                      onClick={() => onChangeOpen(false)}
                    />
                  )}
                </Absolute>
              )}
            </View>

            <Stack
              flex={1}
              alignItems="center"
              justifyContent="center"
              padding={[10, 0]}
              {...props as any}
            />
          </Modal>
        </Theme>
      </Scale>
    )
  },
)
