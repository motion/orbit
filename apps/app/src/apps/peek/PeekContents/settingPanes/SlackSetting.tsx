import * as React from 'react'
import * as UI from '@mcro/ui'
import { view, react } from '@mcro/black'
import { Bit } from '@mcro/models'
import { Bits } from '../../../../views/Bits'
import { TimeAgo } from '../../../../views/TimeAgo'
import * as _ from 'lodash'
import { ReactiveCheckBox } from '../../../../views/ReactiveCheckBox'
import { SettingPaneProps } from './SettingPaneProps'

const columnSizes = {
  repo: 'flex',
  org: 'flex',
  lastCommit: '20%',
  numIssues: '12%',
  active: '10%',
}

const columns = {
  name: {
    value: 'Name',
    sortable: true,
    resizable: true,
  },
  topic: {
    value: 'Topic',
    sortable: true,
    resizable: true,
  },
  members: {
    value: 'Members',
    sortable: true,
    resizable: true,
  },
  lastActive: {
    value: 'Last Active',
    sortable: true,
    resizable: true,
  },
  active: {
    value: 'Active',
    sortable: true,
  },
}

class SlackSettingStore {
  syncing = {}
  active = 'repos'

  setActiveKey = key => {
    this.active = key
  }

  get setting() {
    return this.props.setting
  }

  get service() {
    return this.props.appStore.services.slack
  }

  bits = react(() => Bit.find({ where: { integration: 'slack' } }))

  get allChannels() {
    return _.orderBy(
      this.service.allChannels || [],
      ['is_private', 'num_members'],
      ['asc', 'desc'],
    )
  }

  rows = react(
    () => this.allChannels,
    channels => {
      return channels.map((channel, index) => {
        console.log('channel', channel)
        const topic = channel.topic ? channel.topic.value : ''
        const isActive = () => this.isSyncing(channel.id)
        return {
          key: `${index}`,
          columns: {
            name: {
              sortValue: channel.name,
              value: channel.name,
            },
            topic: {
              sortValue: topic,
              value: topic,
            },
            members: {
              sortValue: channel.num_members,
              value: channel.num_members,
            },
            lastActive: {
              sortValue: Date.now(),
              value: <TimeAgo>{Date.now()}</TimeAgo>,
            },
            active: {
              sortValue: isActive,
              value: (
                <ReactiveCheckBox
                  onChange={this.onSync(channel.id)}
                  isActive={isActive}
                />
              ),
            },
          },
        }
      })
    },
    {
      immediate: true,
      defaultValue: [],
    },
  )

  onSync = fullName => async e => {
    this.setting.values = {
      ...this.setting.values,
      channels: {
        ...this.setting.values.channels,
        [fullName]: e.target.checked,
      },
    }
    await this.setting.save()
  }

  isSyncing = fullName => {
    if (!this.setting || !this.setting.values.channels) {
      return false
    }
    return this.setting.values.channels[fullName] || false
  }
}

const InvisiblePane = view(UI.FullScreen, {
  opacity: 0,
  pointerEvents: 'none',
  visible: {
    opacity: 1,
    pointerEvents: 'auto',
  },
})

@view.provide({ store: SlackSettingStore })
@view
export class SlackSetting extends React.Component<
  SettingPaneProps & { store: SlackSettingStore }
> {
  render() {
    const { store, children } = this.props
    console.log(1232222222222222222222222)
    return children({
      subhead: (
        <UI.Tabs active={store.active} onActive={store.setActiveKey}>
          <UI.Tab key="repos" width="50%" label="Repos" />
          <UI.Tab
            key="issues"
            width="50%"
            label={`Issues (${store.bits ? store.bits.length : 0})`}
          />
        </UI.Tabs>
      ),
      content: (
        <>
          <InvisiblePane visible={store.active === 'repos'}>
            <UI.SearchableTable
              virtual
              rowLineHeight={28}
              floating={false}
              columnSizes={columnSizes}
              columns={columns}
              onRowHighlighted={this.onRowHighlighted}
              multiHighlight
              rows={store.rows}
              bodyPlaceholder={
                <div style={{ margin: 'auto' }}>
                  <UI.Text size={1.2}>Loading...</UI.Text>
                </div>
              }
            />
          </InvisiblePane>
          <InvisiblePane visible={store.active === 'issues'}>
            <Bits bits={store.bits} />
          </InvisiblePane>
        </>
      ),
    })
  }
}
