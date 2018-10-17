import { SlackApp } from './views/SlackApp'
import { SlackSettings } from './views/SlackSettings'
import { Setting, GenericBit } from '@mcro/models'
// @ts-ignore
import iconSlack from '../../../../public/icons/slack.svg'
import { GetOrbitApp, ItemProps } from '../../types'
import { findManyType } from '../../helpers/queries'
import { SlackItem } from './views/SlackItem'

export const slack: GetOrbitApp<'slack'> = (setting?: Setting) => ({
  source: 'bit',
  integration: 'slack',
  integrationName: 'Slack',
  defaultQuery: (findManyType('slack') as unknown) as any,
  display: {
    name: setting.name,
    icon: iconSlack,
  },
  views: {
    main: SlackApp,
    item: SlackItem,
    setting: SlackSettings,
  },
})

export type SlackAppProps = ItemProps<GenericBit<'slack'>>
