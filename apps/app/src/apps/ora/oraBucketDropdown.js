import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'

const iconProps = {
  color: [255, 255, 255, 0.5],
  padding: 8,
  size: 15,
  hover: {
    color: [255, 255, 255, 1],
  },
  css: {
    marginLeft: -8,
  },
}

@view.attach('oraStore')
@view
export default class BucketsDropdown {
  cancelCrawler = () => {
    console.log('canceling')
    this.props.oraStore.crawler.stop()
  }

  render() {
    const settings = CurrentUser.user.settings || {}
    const { buckets = ['Default'], activeBucket = 'Default' } = settings
    return (
      <UI.Popover
        openOnHover
        delay={150}
        closeOnEsc
        overlay="transparent"
        theme="light"
        width={150}
        target={
          <UI.Icon
            key="icon-bucket"
            {...iconProps}
            name="bucket"
            opacity={0.015}
            onClick={this.handleBucketClick}
          />
        }
      >
        <UI.List
          key="bucket-list"
          items={[
            {
              children: 'Cancel crawler',
              onClick: this.cancelCrawler,
            },
            ...buckets.map(name => ({
              primary: name,
              icon: name === activeBucket ? 'check' : null,
            })),
            {
              children: (
                <UI.Input
                  onEnter={e => {
                    if (e.target.value) {
                      CurrentUser.user.mergeUpdate({
                        settings: {
                          buckets: [...buckets, e.target.value],
                        },
                      })
                    }
                  }}
                  placeholder="Create..."
                />
              ),
            },
          ]}
          onSelect={this.selectBucket}
        />
      </UI.Popover>
    )
  }
}
