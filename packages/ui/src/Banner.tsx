import { createStoreContext } from '@o/use-store'
import { FullScreen } from 'gloss'
import { filter } from 'lodash'
import React, { FunctionComponent, memo, useCallback, useRef } from 'react'

import { Button } from './buttons/Button'
import { useOnUnmount } from './hooks/useOnUnmount'
import { Message } from './text/Message'
import { SimpleText } from './text/SimpleText'
import { Row } from './View/Row'
import { View } from './View/View'

export type BannerProps = {
  message: string
  type?: 'warn' | 'success' | 'error' | 'info'
  /** This is the callback you can pass in optionally to do things when it closes */
  onClose?: () => void
}

type BannerContent = Pick<BannerProps, 'message' | 'type'>

type BannerItem = BannerContent & {
  key: number
  set: (props: Partial<BannerProps>) => void
  close: () => void
  onClose?: () => void
}

class BannerStore {
  banners: BannerItem[] = []

  set(key: number, props: Partial<BannerProps>) {
    const banner = this.banners.find(x => x.key === key)
    Object.assign(banner, props)
    this.banners = [...this.banners]
  }

  show(banner: BannerProps) {
    const key = Math.random()
    const bannerItem: BannerItem = {
      ...banner,
      key,
      set: this.set.bind(null, key),
      close: this.hide.bind(null, key),
    }
    this.banners = [...this.banners, bannerItem]
    return bannerItem
  }

  hide(key: number) {
    const toRemove = this.banners.find(x => x.key === key)
    if (toRemove) {
      if (toRemove.onClose) {
        toRemove.onClose()
      }
      this.banners = filter(this.banners, x => x.key !== key)
    }
  }
}

const BannerManager = createStoreContext(BannerStore)

export const ProvideBanner = memo(
  ({
    children,
    template = Banner,
  }: {
    children: any
    template?: FunctionComponent<BannerViewProps>
  }) => {
    const bannerStore = BannerManager.useCreateStore()
    const BannerView = template
    return (
      <BannerManager.SimpleProvider value={bannerStore}>
        {children}

        {/* default to a bottom fixed position, we can make this customizable */}
        <FullScreen pointerEvents="none" top="auto" zIndex={1000000000}>
          {bannerStore.banners.map(banner => (
            <BannerView
              key={JSON.stringify(banner)}
              {...banner}
              close={() => bannerStore.hide(banner.key)}
            />
          ))}
        </FullScreen>
      </BannerManager.SimpleProvider>
    )
  },
)

export type BannerHandle = Pick<BannerItem, 'close' | 'set'>

export function useBanner(): BannerHandle {
  const bannerStore = BannerManager.useStore()
  const banner = useRef<BannerItem>(null)

  useOnUnmount(() => {
    if (banner.current) {
      banner.current.close()
    }
  })

  return {
    set: useCallback((props: Partial<BannerProps>) => {
      if (banner.current) {
        banner.current.set(props)
      } else {
        banner.current = bannerStore.show({
          message: '',
          ...props,
        })
      }
    }, []),
    close: useCallback(() => {
      if (banner.current) {
        banner.current.close()
      }
    }, []),
  }
}

export type BannerViewProps = BannerProps & { close: () => void }

export function Banner(props: BannerViewProps) {
  return (
    <View width="100%" overflow="hidden" background={theme => theme.background}>
      <Message
        className="ui-banner"
        sizeRadius={0}
        pointerEvents="auto"
        position="relative"
        alt={props.type}
        width="100%"
      >
        <Row flex={1} justifyContent="space-between" alignItems="center">
          <SimpleText whiteSpace="pre">{props.message}</SimpleText>
          <Button
            alignSelf="flex-start"
            chromeless
            icon="cross"
            iconSize={20}
            onClick={props.close}
          />
        </Row>
      </Message>
    </View>
  )
}
