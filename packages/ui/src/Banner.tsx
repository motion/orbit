import { createStoreContext } from '@o/use-store'
import { FullScreen } from 'gloss'
import { filter } from 'lodash'
import React, { FunctionComponent, memo } from 'react'

import { Button } from './buttons/Button'
import { Message } from './text/Message'
import { Row } from './View/Row'
import { View } from './View/View'

type BannerProps = {
  message: string
  type?: 'warn' | 'success' | 'fail'

  /** This is the callback you can pass in optionally to do things when it closes */
  onClose?: () => void
}

type BannerItem = BannerProps & {
  key: number
}

class BannerStore {
  banners: BannerItem[] = []

  show(banner: BannerProps) {
    this.banners = [...this.banners, { type: 'warn', ...banner, key: Math.random() }]
  }

  hide(key: number) {
    const toRemove = this.banners.find(x => x.key === key)
    if (toRemove.onClose) {
      toRemove.onClose()
    }
    this.banners = filter(this.banners, x => x.key !== key)
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

export function useBanner() {
  return BannerManager.useStore()
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
          {props.message}
          <Button chromeless icon="cross" iconSize={20} onClick={props.close} />
        </Row>
      </Message>
    </View>
  )
}
