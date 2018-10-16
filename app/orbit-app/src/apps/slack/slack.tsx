import { SlackApp } from './views/SlackApp'
import { SlackSettings } from './views/SlackSettings'
import { Setting, GenericBit } from '@mcro/models'
// @ts-ignore
import iconSlack from '../../../public/icons/slack.svg'
import { GetOrbitApp, ItemProps } from '../types'
import { findManyType } from '../helpers/queries'
import { SlackItem } from './views/SlackItem'

export const slack: GetOrbitApp<'slack'> = (setting?: Setting) => ({
  config: {
    icon: iconSlack,
  },
  source: 'bit',
  integration: 'slack',
  integrationName: 'Slack',
  displayName: setting.name,
  defaultQuery: (findManyType('slack') as unknown) as any,
  views: {
    main: SlackApp,
    item: SlackItem,
    setting: SlackSettings,
  },
})

export type SlackAppProps = ItemProps<GenericBit<'slack'>>
